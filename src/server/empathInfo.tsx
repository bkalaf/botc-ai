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
import { addMyNightInfoClaim } from '../store/memory/memory-slice';
import { buildHandler } from './buildHandler';
import { openDialog } from '@/lib/dialogs';
import { clearTask } from './clearTask';
import { selectDay } from '../store/game/game-slice';
import { ISeatedPlayer } from '../store/types/player-types';
import { rangeFrom } from './rangeFrom';

const EmpathInfoReturnSchema = z
    .object({
        count: z.number().gte(0).lte(2).describe('Empaths reported evil neighbor count.').nullable().optional(),
        reasoning: z
            .string()
            .describe(
                'Brief ST philosophy explaining the result, including misregistration and sobriety considerations.'
            )
    })
    .strict();

type EmpathResult = 'YES' | 'NO' | 'MAYBE-SPY' | 'MAYBE-RECLUSE';

function pairWithNextAndPrevious<T>(arr: T[]): [T, T, T][] {
    if (arr.length === 0) return [];

    return arr.map((value, i) => {
        const next = i + 1 > arr.length ? 0 : i + 1;
        const next2 =
            i + 2 > arr.length ?
                next === 0 ?
                    1
                :   0
            :   i + 2;
        return [value, arr[next], arr[next2]];
    });
}

function calculateEmpathNumber(seats: Record<number, ISeatedPlayer>): [true, number[]] | [false] {
    function evaluatePlayer(player: ISeatedPlayer) {
        const isDroisened = player.isDrunk || player.isPoisoned;
        if (player.role === 'spy') {
            return isDroisened ? 'YES' : 'MAYBE-SPY';
        } else if (player.role === 'recluse') {
            return isDroisened ? 'NO' : 'MAYBE-RECLUSE';
        }
        return player.alignment === 'evil' ? 'YES' : 'NO';
    }
    const pairs = pairWithNextAndPrevious(Object.values(seats).filter((x) => x.isAlive));
    const responses: EmpathResult[] = [];
    const result = pairs.find((x) => x[1].thinks ?? x[1].role === 'empath');
    if (!result) return [false];
    const [player1, player2, player3] = result;
    const isDroisened = player2.isDrunk || player2.isPoisoned;
    responses.push(evaluatePlayer(player1));
    responses.push(evaluatePlayer(player3));
    const count = responses.filter((x) => x === 'YES').length;
    const opt = responses.filter((x) => x === 'MAYBE-SPY' || x === 'MAYBE-RECLUSE').length + 1;
    const output = isDroisened ? [0, 1, 2] : rangeFrom(count, opt);
    return [true, output];
}
export const empathNumberServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data) => InputSchema.parse(data))
    .handler(async ({ data }) => {
        const { system, user } = createPrompt(empathNumber, data);
        console.log(`promptText`, system);
        console.log(`promptText`, user);
        const [isAlive, counts] = calculateEmpathNumber(data.extractedSeats as any);
        if (!isAlive) {
            return { count: null, reasoning: 'Not alive' };
        } else if (counts.length === 1) {
            return { count: counts[0], reasoning: 'Only 1 allowed response.' };
        }
        const client = getClient();
        const response = await client.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            response_format: zodResponseFormat(EmpathInfoReturnSchema, 'EmpathNumberOutput')
        });
        console.log(`response`, response);

        const parsed = response.choices?.[0]?.message?.parsed;
        if (!counts.includes(parsed?.count ?? -1)) {
            throw new Error('bad empath number');
        }
        if (parsed == null) {
            throw new Error('no parsed decision');
        }
        console.log(`parsed`, parsed);

        return parsed as any;
    });

export const empathHandler = (state: RootState, dispatch: AppDispatch) => {
    const func = async ({ confirmed, value }: { confirmed: boolean; value: { count: number } }) => {
        const day = selectDay(state);
        const seat = selectSeatByRole(state, 'empath');
        if (seat == null) throw new Error(`no empath seat`);
        const {
            ID,
            player: { controledBy }
        } = seat;
        if (controledBy === 'ai') {
            dispatch(
                addMyNightInfoClaim({
                    ID,
                    seat: ID,
                    day,
                    role: 'empath',
                    data: value?.count
                })
            );
            clearTask(dispatch);
        } else {
            const result = await openDialog({ dispatch, dialogType: 'empathInfo', data: { count: value.count } });
            if (result.confirmed) {
                clearTask(dispatch);
            }
        }
    };
    return buildHandler(empathNumberServerFn, func);
};
