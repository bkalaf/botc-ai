// src/server/fortunetellerInfo.tsx
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { fortuneTellerInfo } from '../prompts/fortuneTellerInfo';

const FortuneTellerInfoReturnSchema = z.object({
    shown: z.boolean(),
    reasoning: z.string()
});

export const FortuneTellerInfoInputSchema = InputSchema.extend({
    seats: z.array(z.number())
});

export const fortuneTellerInfoServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => FortuneTellerInfoInputSchema.parse(data))
    .handler(async ({ data }) => {
        const promptText = createPrompt(fortuneTellerInfo, data);
        const $promptText = [promptText, `CHOICES: ${data.seats.join(', ')}`].join('\n');
        console.log(`promptText`, promptText);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a Blood on the Clocktower Storyteller.' },
                { role: 'user', content: $promptText }
            ],
            response_format: zodResponseFormat(FortuneTellerInfoReturnSchema, 'fortunetellerinfo_decision')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return {
            ...parsed,
            seats: data.seats
        };
    });

// export const fortuneTellerInfoHandler = (
//     state: RootState,
//     dispatch: AppDispatch,
//     { setControls, setDescription, setTitle, setSubmit }: UIContextType
// ) => {
//     const func = (data: { shown: boolean, seats: number[] }) => {
//         const seat = selectSeatByRole(state, 'fortuneteller');
//         if (seat == null) throw new Error(`no fortuneteller seat`);
//         const {
//             ID,
//             player: { controledBy }
//         } = seat;
//         if (controledBy === 'ai') {
//             dispatch(
//                 addClaim({
//                     ID,
//                     role: 'fortuneteller',
//                     data: {
//                         shown: data.shown,
//                         seats: data.seats
//                     }
//                 })
//             );
//         } else {
//             const Icon = getBooleanIcon(data.shown);
//             const controls = <Icon />;
//             setTitle('Night Info');
//             setDescription('You are shown:');
//             setControls(controls);
//             setSubmit(async () => {});
//             dispatch(showUserInputDialog());
//         }
//     };
//     return buildHandler(empathNumberServerFn, func);
// };
