// src/server/washerwomanInfo.tsx
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { washerwomanTokens } from '../prompts/washerwomanTokens';
import { $$ROLES } from '../data/types';
import { RootState, AppDispatch } from '../store';
import { addReminderToken, selectSeatByRole, selectSeatedPlayers } from '../store/grimoire/grimoire-slice';
import { addClaim } from '../store/memory/memory-slice';
import { openDialog } from '@/lib/dialogs';
import { buildHandler } from './buildHandler';
import { clearTask } from './clearTask';

const WasherwomanInfoReturnSchema = z.object({
    correctSeat: z.int().nullable(),
    shown: z.object({
        role: z.string(),
        seats: z.array(z.number())
    }),
    reasoning: z.string()
});

export const washerwomanInfoServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const promptText = createPrompt(washerwomanTokens, data);
        console.log(`promptText`, promptText);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a Blood on the Clocktower Storyteller.' },
                { role: 'user', content: promptText }
            ],
            response_format: zodResponseFormat(WasherwomanInfoReturnSchema, 'washerwomaninfo_decision')
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
        value: z.infer<typeof WasherwomanInfoReturnSchema>;
    }) => {
        const correct = correctSeat ?? shown.seats[0];
        const incorrect = correctSeat ? shown.seats.filter((x) => x != correct)[0] : shown.seats[1];
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
        value: z.infer<typeof WasherwomanInfoReturnSchema>;
    }) => {
        const seat = selectSeatByRole(state, 'washerwoman');
        if (seat == null) throw new Error(`no washerwoman seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            dispatch(
                addClaim({
                    ID,
                    role: 'washerwoman',
                    data: { correctSeat, shown }
                })
            );
            setTokens({ ID, value: { correctSeat, shown, reasoning } });
        } else {
            const seat1 = selectSeatedPlayers(state).find((x) => x.ID === shown.seats[0]);
            const seat2 = selectSeatedPlayers(state).find((x) => x.ID === shown.seats[1]);
            const name = $$ROLES[shown.role];
            const result = await openDialog({
                dispatch,
                dialogType: 'washerwomanInfo',
                data: {
                    roleName: name.name,
                    seatNames: [seat1?.name ?? 'Unknown', seat2?.name ?? 'Unknown']
                }
            });
            if (result.confirmed) {
                setTokens({ ID, value: { correctSeat, shown, reasoning } });
            }
        }
    };
    return buildHandler(washerwomanInfoServerFn, func);
};
