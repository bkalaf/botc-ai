// src/server/librarianInfo.tsx
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { librarianTokens } from '../prompts/librarianTokens';
import { addMyNightInfoClaim, addNightInfoClaim } from '../store/memory/memory-slice';
import { addReminderToken, selectSeatByRole, selectSeatedPlayers } from '../store/grimoire/grimoire-slice';
import { Roles, $$ROLES } from '../data/types';
import { RootState, AppDispatch } from '../store';
import { openDialog } from '@/lib/dialogs';
import { buildHandler } from './buildHandler';
import { clearTask } from './clearTask';
import { selectDay } from '../store/game/game-slice';

const LibrarianInfoReturnSchema = z
    .object({
        shown: z
            .object({
                role: z
                    .enum(['saint', 'recluse', 'drunk', 'butler'])
                    .describe(
                        'The role shown to the Librarian. Must be an outsider or null if there are no outsiders in play.'
                    )
                    .nullable()
                    .optional(),
                seats: z
                    .array(
                        z
                            .number()
                            .gte(0)
                            .lte(15)
                            .describe(
                                'The two seats that are shown to the Librarian or an empty array if there are no outsiders in play.'
                            )
                    )
                    .min(0)
                    .max(2)
            })
            .strict(),
        correctSeat: z
            .number()
            .gte(1)
            .lte(15)
            .describe(
                'The correct seat for the shown roles. Must be one of the two values in shown.seats if sober and healthy information. null if this is drunk or poisoned information or there are no outsiders in play.'
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

export const librarianInfoServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const { system, user } = createPrompt(librarianTokens, data);
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(LibrarianInfoReturnSchema, 'LibrarianTokenOutput')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });

export const librarianHandler = (state: RootState, dispatch: AppDispatch) => {
    const setTokens = async ({
        ID,
        value: { correctSeat, shown }
    }: {
        ID: number;
        value: z.infer<typeof LibrarianInfoReturnSchema>;
    }) => {
        const [correct, incorrect] =
            correctSeat ? [correctSeat, shown.seats.filter((x) => x !== correctSeat)[0]] : shown.seats;
        dispatch(
            addReminderToken({
                key: 'librarian_outsider',
                source: ID,
                target: correct,
                isChanneled: false
            })
        );
        dispatch(
            addReminderToken({
                key: 'librarian_wrong',
                source: ID,
                target: incorrect,
                isChanneled: false
            })
        );
        clearTask(dispatch);
    };
    const func = async ({
        value: data
    }: {
        confirmed: boolean;
        value: {
            correctSeat: number;
            shown: { role: Roles; seats: [number, number] };
            reasoning: string;
        };
    }) => {
        const day = selectDay(state);
        const seat = selectSeatByRole(state, 'librarian');
        if (seat == null) throw new Error(`no librarian seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            dispatch(
                addMyNightInfoClaim({
                    seat: ID,
                    ID,
                    role: 'librarian',
                    data: data.shown,
                    day
                })
            );
            setTokens({
                ID,
                value: { correctSeat: data.correctSeat, shown: data.shown as any, reasoning: data.reasoning }
            });
        } else {
            const seat1 = selectSeatedPlayers(state).find((x) => x.ID === data.shown.seats[0]);
            const seat2 = selectSeatedPlayers(state).find((x) => x.ID === data.shown.seats[1]);
            const name = $$ROLES[data.shown.role];
            await openDialog({
                dispatch,
                dialogType: 'librarianInfo',
                data: {
                    roleName: name.name,
                    seatNames: [seat1?.name ?? 'Unknown', seat2?.name ?? 'Unknown']
                }
            });
            setTokens({ ID, value: data as any });
        }
    };
    return buildHandler(librarianInfoServerFn, func);
};
