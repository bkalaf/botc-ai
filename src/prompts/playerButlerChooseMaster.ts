// src/prompts/playerButlerChooseMaster.ts
//src/prompts/playerButlerChooseMaster.ts
import { PromptSpec } from './prompt-types';

export const playerButlerChooseMaster: PromptSpec = {
    id: 'player-butler-choose-master',
    version: '1.0',
    title: 'Butler – Choose Master',
    tags: ['botc', 'player', 'butler', 'night'],
    perspective: 'player',

    instructions: [
        'You are an AI player in a game of Blood on the Clocktower.',
        'Your role is the Butler.',
        'Each night, you must choose a living player to be your Master.',
        'Tomorrow, you may only vote if your Master votes.',
        'This choice is secret and should be made with awareness of both social and mechanical consequences.'
    ],

    guidelines: [
        'SELF-PRESERVATION: Choose a Master whose voting behavior will not unnecessarily restrict your ability to participate.',
        'ALIGNMENT AWARENESS: If you believe you are Good, prefer a Master you trust to vote in critical moments.',
        'MISDIRECTION: If you believe you are Evil or suspected, your Master choice can be used to confuse or frame.',
        'FLEXIBILITY: Avoid choosing a Master who is likely to die, be executed, or abstain from voting.',
        'CONSISTENCY: Your choice should make sense with your public behavior and claims if it is later revealed.'
    ],

    goal: 'Select a Master whose voting behavior best supports your strategy, survival, and alignment goals for the coming day.',

    additionalConsiderations: [
        'SOCIAL SIGNALING: While the Master choice is private, its effects may become visible through your voting behavior.',
        'ENDGAME IMPACT: In late-game scenarios, Master selection can directly decide whether you are able to vote at all.',
        'EXECUTION RISK: If you expect to be executed or heavily scrutinized, choose a Master whose votes align with your desired narrative.',
        'TRUST VS CONTROL: A highly active Master gives you more chances to vote; a passive Master gives you cover but less agency.',
        'POISON / DRUNK STATUS: If you suspect you may be drunk or poisoned, your choice may be unreliable, but should still appear reasonable.'
    ],

    input: [
        'Your seat number',
        'List of living players with seat numbers',
        'Public claims and voting behavior so far',
        'Your current suspicion map',
        'Current day and night number',
        'Your personality profile (if applicable)'
    ],

    output: {
        chosenSeat: 'Seat number of the player you choose as your Master',
        reasoning: 'A brief in-character explanation of why this player was chosen as your Master.'
    },

    schema: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'ButlerChooseMaster',
        type: 'object',
        additionalProperties: false,
        required: ['chosenSeat', 'reasoning'],
        properties: {
            chosenSeat: {
                type: 'number',
                minimum: 1,
                maximum: playerCount,
                description: 'Seat number of the player you choose as your Master. This must not be yourself.'
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                description:
                    'A brief in-character explanation of why this player was chosen as your Master. Limit 2 sentences prefer 1.'
            }
        }
    })
};
