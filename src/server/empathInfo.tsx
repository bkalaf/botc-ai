// src/server/empathInfo.tsx
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { empathNumber } from '../prompts/empathNumber';
import { RootState, AppDispatch } from '../store';
import { selectSeatByRole } from '../store/grimoire/grimoire-slice';
import { addClaim } from '../store/memory/memory-slice';
import { buildHandler } from './buildHandler';
import { getIcon } from './getIcon';
import { closeDialog, showDialog } from '../store/ui/ui-slice';
import { clearTask } from './clearTask';

const EmpathInfoReturnSchema = z.object({
    shown: z.object({
        count: z.int()
    }),
    reasoning: z.string()
});

export const empathNumberServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const promptText = createPrompt(empathNumber, data);
        console.log(`promptText`, promptText);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a Blood on the Clocktower Storyteller.' },
                { role: 'user', content: promptText }
            ],
            response_format: zodResponseFormat(EmpathInfoReturnSchema, 'empathinfo_decision')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });

export const empathHandler = (state: RootState, dispatch: AppDispatch) => {
    const func = ({ confirmed, value }: { confirmed: boolean; value: { shown: { count: number } } }) => {
        const seat = selectSeatByRole(state, 'empath');
        if (seat == null) throw new Error(`no empath seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            dispatch(
                addClaim({
                    ID,
                    role: 'empath',
                    data: value?.shown.count
                })
            );
            clearTask(dispatch);
        } else {
            const Icon = getIcon(value?.shown.count);
            const controls = () => <Icon />;
            dispatch(
                showDialog({
                    options: {
                        title: 'Night Info',
                        message: 'You are shown:',
                        Controls: controls
                    },
                    resolve: () => {
                        clearTask(dispatch);
                    },
                    reject: (reason: string) => {
                        console.log(reason);
                    }
                })
            );
        }
    };
    return buildHandler(empathNumberServerFn, func);
};
