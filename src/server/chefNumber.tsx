// src/server/chefNumber.tsx
import { createServerFn } from '@tanstack/react-start';
import { InputSchema } from '../prompts/prompt-types';
import { createPrompt } from '../prompts/createPrompt';
import z from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { getClient } from './openaiClient';
import { chefNumber } from '../prompts/chefNumber';
import { RootState, AppDispatch } from '../store';
import { selectSeatByRole } from '../store/grimoire/grimoire-slice';
import { addClaim, addMyNightInfoClaim } from '../store/memory/memory-slice';
import { openDialog } from '@/lib/dialogs';
import { buildHandler } from './buildHandler';
import { clearTask } from './clearTask';
import { selectDay } from '../store/game/game-slice';
import { ISeatedPlayer } from '../store/types/player-types';
import { rangeFrom } from './rangeFrom';

const ChefNumberReturnSchema = z
    .object({
        count: z.number().gte(0).lte(6).describe('The chefs reported adjacent Evil pair count.'),
        reasoning: z
            .string()
            .describe(
                'Brief ST philosophy explaining the choice, including any misregistration and/or sobriety considerations.'
            )
    })
    .strict();

function pairWithNext<T>(arr: T[]): [T, T][] {
    if (arr.length === 0) return [];

    return arr.map((value, i) => {
        const next = i + 1 > arr.length ? 0 : i + 1;
        return [value, arr[next]];
    });
}
type ChefResult = 'YES' | 'NO' | 'MAYBE-SPY' | 'MAYBE-RECLUSE' | 'MAYBE-SPY-RECLUSE';

function calculateChefNumber(seats: Record<number, ISeatedPlayer>): [boolean, number[]?] {
    const responses: ChefResult[] = [];
    const chef = Object.values(seats).find((x) => (x.thinks ?? x.role) === 'chef');
    const isDroisened = chef?.isDrunk || chef?.isPoisoned;
    const pairs = pairWithNext(
        Object.values(seats).map((x) =>
            x.alignment === 'evil' ?
                x.role === 'spy' ?
                    x.isDrunk || x.isPoisoned ?
                        'YES'
                    :   'MAYBE-SPY'
                :   'YES'
            : x.role === 'recluse' ?
                x.isDrunk || x.isPoisoned ?
                    'NO'
                :   'MAYBE-RECLUSE'
            :   'NO'
        ) as ChefResult[]
    );
    for (const [player1, player2] of pairs) {
        switch (player1) {
            case 'NO': {
                responses.push('NO');
                break;
            }
            case 'YES': {
                switch (player2) {
                    case 'YES':
                        responses.push('YES');
                        break;
                    case 'NO':
                        responses.push('NO');
                        break;
                    case 'MAYBE-SPY':
                        responses.push('MAYBE-SPY');
                        break;
                    case 'MAYBE-RECLUSE':
                        responses.push('MAYBE-RECLUSE');
                        break;
                }
                break;
            }
            case 'MAYBE-SPY': {
                switch (player2) {
                    case 'YES':
                        responses.push('MAYBE-SPY');
                        break;
                    case 'NO':
                        responses.push('NO');
                        break;
                    case 'MAYBE-SPY':
                    case 'MAYBE-RECLUSE':
                        responses.push('MAYBE-SPY-RECLUSE');
                        break;
                }
                break;
            }
            case 'MAYBE-RECLUSE': {
                switch (player2) {
                    case 'YES':
                        responses.push('MAYBE-RECLUSE');
                        break;
                    case 'NO':
                        responses.push('NO');
                        break;
                    case 'MAYBE-SPY':
                    case 'MAYBE-RECLUSE':
                        responses.push('MAYBE-SPY-RECLUSE');
                        break;
                }
                break;
            }
        }
    }
    console.log(`responses`, responses);
    if (isDroisened) {
        return [false];
    } else if (responses.some((el) => ['MAYBE-SPY', 'MAYBE-RECLUSE', 'MAYBE-SPY-RECLUSE'].includes(el))) {
        const baseStart = responses.filter((el) => el === 'YES').length;
        const optional = responses.filter((el) => el !== 'NO' && el !== 'YES').length + 1;
        return [false, rangeFrom(baseStart, optional)];
    } else {
        return [true, [responses.filter((el) => el === 'YES').length]];
    }
}
export const chefNumberServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const { system, user } = createPrompt(chefNumber, data);
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const [isDeterminate, counts] = calculateChefNumber(data.extractedSeats as any);
        if (isDeterminate) {
            console.log('not calling server function only 1 response allowed');
            return { count: counts![0], reasoning: 'Only 1 allowed response.' };
        }
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(ChefNumberReturnSchema, 'ChefNumberOutput')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (counts ? !counts?.includes(parsed?.count ?? -1) : false) {
            throw new Error(
                `bad chef number received: possible: ${counts!.join(', ')} received: ${parsed?.count ?? -1}`
            );
        }
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });

export const chefHandler = (state: RootState, dispatch: AppDispatch) => {
    const func = async ({ value }: { value: { count: number } }) => {
        const day = selectDay(state);
        const seat = selectSeatByRole(state, 'chef');
        if (seat == null) throw new Error(`no chef seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            dispatch(
                addMyNightInfoClaim({
                    ID,
                    seat: ID,
                    role: 'chef',
                    data: { count: value.count },
                    day
                })
            );
            clearTask(dispatch);
        } else {
            const result = await openDialog({ dispatch, dialogType: 'chefInfo', data: { count: value.count } });
            if (result.confirmed) {
                clearTask(dispatch);
            }
        }
    };
    return buildHandler(chefNumberServerFn, func);
};
