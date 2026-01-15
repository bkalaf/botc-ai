// src/server/washerwomanInfo.tsx
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { washerwomanTokens } from '../prompts/washerwomanTokens';
import { $$ROLES, Roles } from '../data/types';
import { RootState, AppDispatch } from '../store';
import { addReminderToken, selectSeatByRole, selectSeatedPlayers } from '../store/grimoire/grimoire-slice';
import { addMyNightInfoClaim, addNightInfoClaim } from '../store/memory/memory-slice';
import { openDialog } from '@/lib/dialogs';
import { buildHandler } from './buildHandler';
import { clearTask } from './clearTask';
import { selectDay } from '../store/game/game-slice';

const WasherwomanInfoReturnSchema = (playerCount: number) =>
    z
        .object({
            shown: z
                .object({
                    role: z
                        .enum([
                            'monk',
                            'empath',
                            'fortuneteller',
                            'undertaker',
                            'virgin',
                            'librarian',
                            'investigator',
                            'washerwoman',
                            'chef',
                            'mayor',
                            'slayer',
                            'soldier',
                            'ravenkeeper'
                        ])
                        .describe('The role shown to the Washerwoman. Must be a townsfolk.'),
                    seats: z
                        .array(
                            z
                                .number()
                                .gte(1)
                                .lte(playerCount)
                                .describe('The two seats that are shown to the Washerwoman')
                        )
                        .min(2)
                        .max(2)
                })
                .strict(),
            correctSeat: z
                .number()
                .gte(1)
                .lte(playerCount)
                .describe(
                    'The correct seat for the shown roles. Must be one of the two values in shown.seats if sober and healthy information. null if this is drunk or poisoned information.'
                )
                .nullable()
                .optional(),
            reasoning: z
                .string()
                .describe(
                    'Brief ST philosophy for why this show is good for balance, drama, and plausibility. Max 2 sentences, prefer 1.'
                )
        })
        .strict();

export const washerwomanInfoServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const { system, user } = createPrompt(washerwomanTokens, data);
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(
                WasherwomanInfoReturnSchema(data.extractedSeats.length),
                'washerwomaninfo_decision'
            )
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });

export const washerwomanHandler = (state: RootState, dispatch: AppDispatch) => {
    const setTokens = async ({
        ID,
        value: { correctSeat, shown }
    }: {
        ID: number;
        value: { correctSeat?: number; shown: { role: Roles; seats: number[] } };
    }) => {
        const [correct, incorrect] =
            correctSeat ? [correctSeat, shown.seats.filter((x) => x !== correctSeat)[0]] : shown.seats;
        dispatch(
            addReminderToken({
                key: 'washerwoman_townsfolk',
                source: ID,
                target: correct,
                isChanneled: false
            })
        );
        dispatch(
            addReminderToken({
                key: 'washerwoman_wrong',
                source: ID,
                target: incorrect,
                isChanneled: false
            })
        );
        clearTask(dispatch);
    };
    const func = async ({
        value: { correctSeat, shown, reasoning }
    }: {
        confirmed: boolean;
        value: { correctSeat: number; shown: { role: Roles; seats: number[] }; reasoning: string };
    }) => {
        const day = selectDay(state);
        const seat = selectSeatByRole(state, 'washerwoman');
        if (seat == null) throw new Error(`no washerwoman seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            dispatch(
                addMyNightInfoClaim({
                    seat: ID,
                    ID,
                    day,
                    role: 'washerwoman',
                    data: { shown }
                })
            );
            setTokens({ ID, value: { correctSeat, shown } });
        } else {
            const seat1 = selectSeatedPlayers(state).find((x) => x.ID === shown.seats[0]);
            const seat2 = selectSeatedPlayers(state).find((x) => x.ID === shown.seats[1]);
            const name = $$ROLES[shown.role];
            await openDialog({
                dispatch,
                dialogType: 'washerwomanInfo',
                data: {
                    roleName: name.name,
                    seatNames: [seat1?.name ?? 'Unknown', seat2?.name ?? 'Unknown']
                }
            });
            setTokens({ ID, value: { correctSeat, shown } });
        }
    };
    return buildHandler(washerwomanInfoServerFn, func);
};
