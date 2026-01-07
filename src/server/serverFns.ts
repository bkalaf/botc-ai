// src/server/serverFns.ts
import { demonBluffs } from '../prompts/demonBluffs';
import { drunkChoice } from '../prompts/drunkChoice';
import { fortuneTellersRedHerring } from '../prompts/fortuneTellersRedHerring';
import { InputSchema } from '../prompts/prompt-types';
import { travelerAlignment } from '../prompts/travelerAlignment';
import { requestPromptFunction } from './requestPromptFunction';
import z from 'zod';

export const demonBluffsServerFn = requestPromptFunction(
    demonBluffs,
    z.object({
        shown: z.object({
            roles: z.array(z.string())
        }),
        reasoning: z.string()
    })
);
export const drunkChoiceServerFn = requestPromptFunction(
    drunkChoice,
    z.object({
        shown: z.object({
            seat: z.number()
        }),
        reasoning: z.string()
    })
);
export const fortunetellerRedHerringServerFn = requestPromptFunction(
    fortuneTellersRedHerring,
    z.object({
        shown: z.object({
            seat: z.number()
        }),
        reasoning: z.string()
    })
);
export const travelerAlignmentServerFn = requestPromptFunction(
    travelerAlignment,
    z.object({
        alignment: z.enum(['good', 'evil']),
        travelerID: z.int(),
        reasoning: z.string()
    }),
    InputSchema.extend({
        travelerID: z.int()
    }) as any
);
