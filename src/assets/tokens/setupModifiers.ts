//src/assets/tokens/setupModifiers.ts
export const setupModifiers: Partial<Record<Roles, ISetupModifier[]>> = {
    baron: [{ type: 'character-type', value: [2], increase: 'outsider', decrease: 'townsfolk' }],
    drunk: [
        {
            type: 'masking',
            increase: 'townsfolk',
            decrease: 'outsider',
            role: 'drunk',
            actionKey: 'executeDrunkDecision'
        }
    ],
    sentinel: [{ type: 'character-type', value: [-1, 0, 1], increase: 'outsider', decrease: 'townsfolk' }],
    fortuneteller: [{ type: 'reminder-token', actionKey: 'executeRedHerring' }]
};
