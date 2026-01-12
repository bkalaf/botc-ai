// src/server/fortunetellerChoice.tsx
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { fortuneTellerNightAction } from '../prompts/fortuneTellerNightAction';
import { RootState, AppDispatch } from '../store';
import { selectSeatByRole } from '../store/grimoire/grimoire-slice';
import { addClaim } from '../store/memory/memory-slice';
import { closeDialog, showDialog } from '../store/ui/ui-slice';
import { FortuneTellerInfoInputSchema, fortuneTellerInfoServerFn } from './fortunetellerInfo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { getBooleanIcon } from './getIcon';
import { clearTask } from './clearTask';

const FortuneTellerChoiceReturnSchema = z.object({
    picks: z.object({
        seats: z.array(z.number())
    }),
    reasoning: z.string()
});

export const fortuneTellerChoiceServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const personality = data.extractedSeats.find((x) => x.thinks ?? x.role === 'fortuneteller')?.personality;
        const promptText = createPrompt(fortuneTellerNightAction, data, { personality } as any);
        console.log(`promptText`, promptText);
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a Blood on the Clocktower Player.' },
                { role: 'user', content: promptText }
            ],
            response_format: zodResponseFormat(FortuneTellerChoiceReturnSchema, 'fortuneteller_choice_decision')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed;
    });

export const fortuneTellerChoiceHandler = (state: RootState, dispatch: AppDispatch) => {
    const getInfo = async ({
        ID,
        controledBy,
        ...data
    }: z.infer<typeof FortuneTellerInfoInputSchema> & { ID: number; controledBy: 'ai' | 'human' }) => {
        const response = await fortuneTellerInfoServerFn({ data });
        const { seats, shown } = response;
        if (controledBy === 'ai') {
            dispatch(
                addClaim({
                    ID,
                    role: 'fortuneteller',
                    data: {
                        seats,
                        shown
                    }
                })
            );
            clearTask(dispatch);
        } else {
            const Icon = getBooleanIcon(shown);
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
    const makeChoice = async (data: z.infer<typeof InputSchema>) => {
        const seat = selectSeatByRole(state, 'fortuneteller');
        if (seat == null) throw new Error(`no fortuneteller seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            const response = await fortuneTellerChoiceServerFn({ data });
            const {
                picks: { seats }
            } = response;
            await getInfo({ ...data, ID, controledBy, seats });
        } else {
            const controls = () => (
                <div className='grid grid-cols-2'>
                    <div className='flex'>
                        <Select
                            name='seat1'
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select a seat...' />
                            </SelectTrigger>
                            <SelectContent>
                                {data.extractedSeats.map((el, ix) => (
                                    <SelectItem
                                        key={ix}
                                        value={el.ID.toString()}
                                    >
                                        {el.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex'>
                        <Select
                            name='seat2'
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select a seat...' />
                            </SelectTrigger>
                            <SelectContent>
                                {data.extractedSeats.map((el, ix) => (
                                    <SelectItem
                                        key={ix}
                                        value={el.ID.toString()}
                                    >
                                        {el.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            );
            dispatch(
                showDialog({
                    options: {
                        title: 'Make a choice',
                        message: 'Pick 2 different players',
                        Controls: controls
                    },
                    resolve: async ({
                        confirmed,
                        value: { seat1, seat2 }
                    }: {
                        confirmed: boolean;
                        value: {
                            seat1: string;
                            seat2: string;
                        };
                    }) => {
                        dispatch(closeDialog());
                        await getInfo({
                            ...data,
                            ID,
                            controledBy,
                            seats: [parseInt(seat1, 10), parseInt(seat2, 10)]
                        });
                    },
                    reject: (reason: string) => {
                        console.log(reason);
                    }
                })
            );
        }
    };

    return async (args: z.infer<typeof InputSchema>) => {
        await makeChoice(args);
    };
};
