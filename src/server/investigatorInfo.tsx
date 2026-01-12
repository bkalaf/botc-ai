// src/server/investigatorInfo.tsx
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { investigatorTokens } from '../prompts/investigatorTokens';
import { Roles, $$ROLES } from '../data/types';
import { RootState, AppDispatch } from '../store';
import { addReminderToken, selectSeatByRole, selectSeatedPlayers } from '../store/grimoire/grimoire-slice';
import { addClaim } from '../store/memory/memory-slice';
import { openDialog } from '@/lib/dialogs';
import { buildHandler } from './buildHandler';
import { clearTask } from './clearTask';

const InvestigatorInfoReturnSchema = z.object({
    correctSeat: z.int().nullable(),
    shown: z.object({
        role: z.string(),
        seats: z.array(z.number())
    }),
    reasoning: z.string()
});

export const investigatorInfoServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const promptText = createPrompt(investigatorTokens, data);
        console.log(`promptText`, promptText);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a Blood on the Clocktower Storyteller.' },
                { role: 'user', content: promptText }
            ],
            response_format: zodResponseFormat(InvestigatorInfoReturnSchema, 'investigatorinfo_decision')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });

export const investigatorHandler = (state: RootState, dispatch: AppDispatch) => {
    const setTokens = async ({
        ID,
        value: { correctSeat, shown }
    }: {
        ID: number;
        value: z.infer<typeof InvestigatorInfoReturnSchema>;
    }) => {
        const correct = correctSeat ?? shown.seats[0];
        const incorrect = correctSeat ? shown.seats.filter((x) => x != correct)[0] : shown.seats[1];
        dispatch(
            addReminderToken({
                key: 'investigator_townsfolk',
                source: ID,
                target: correct,
                isChanneled: false
            })
        );
        dispatch(
            addReminderToken({
                key: 'investigator_wrong',
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
        const seat = selectSeatByRole(state, 'investigator');
        if (seat == null) throw new Error(`no investigator seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            dispatch(
                addClaim({
                    ID,
                    role: 'investigator',
                    data: data.shown
                })
            );
            setTokens({ ID, value: { correctSeat: data.correctSeat, shown: data.shown, reasoning: data.reasoning } });
        } else {
            const seat1 = selectSeatedPlayers(state).find((x) => x.ID === data.shown.seats[0]);
            const seat2 = selectSeatedPlayers(state).find((x) => x.ID === data.shown.seats[1]);
            const name = $$ROLES[data.shown.role];
            const result = await openDialog({
                dispatch,
                dialogType: 'investigatorInfo',
                data: {
                    roleName: name.name,
                    seatNames: [seat1?.name ?? 'Unknown', seat2?.name ?? 'Unknown']
                }
            });
            if (result.confirmed) {
                setTokens({ ID, value: data });
            }
        }
    };
    return buildHandler(investigatorInfoServerFn, func);
};
