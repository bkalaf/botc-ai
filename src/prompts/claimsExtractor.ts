// src/prompts/claimsExtractor.ts
import { PromptSpec } from './prompt-types';

export const claimExtractor: PromptSpec = {
    id: 'system-claim-extractor',
    version: '1.0',
    title: 'Conversation → Claims Extractor',
    tags: ['botc', 'system', 'nlp', 'claims'],
    perspective: 'generic',

    instructions: [
        `Extract structured claims from Blood on the Clocktower chat.`,
        `Follow PI wiki role rules and do not invent facts.`,
        `If unsure, lower confidence or omit the claim.`
    ],

    guidelines: [
        `Use seat numbers when available; otherwise keep seat null and use labels.`,
        `Capture timing (day/night) if stated or implied.`,
        `Add a short excerpt for provenance.`
    ],

    goal: `Turn conversation text into structured claim objects.`,

    input: [`Conversation batch`, `Optional seat/name map`, `Optional script roles list`],

    output: ({ playerCount }: { playerCount: number }) => ({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'ClaimExtractorOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                description: 'Extracted claims payload.',
                additionalProperties: false,
                required: ['claims'],
                properties: {
                    claims: {
                        type: 'array',
                        minItems: 0,
                        description: 'Extracted claims from the conversation.',
                        items: {
                            type: 'object',
                            additionalProperties: true,
                            required: [
                                'id',
                                'kind',
                                'visibility',
                                'timing',
                                'source',
                                'payload',
                                'confidence',
                                'suspicion',
                                'corruption'
                            ],
                            properties: {
                                id: {
                                    type: 'string',
                                    minLength: 3,
                                    maxLength: 40,
                                    description: 'Unique claim identifier.'
                                },
                                kind: {
                                    type: 'string',
                                    minLength: 3,
                                    maxLength: 40,
                                    description: 'Claim category (role, info_result, action, etc.).'
                                },
                                visibility: {
                                    type: 'string',
                                    minLength: 3,
                                    maxLength: 20,
                                    description: 'Who can see this claim (public/private/team).'
                                },
                                timing: {
                                    type: 'object',
                                    description: 'Timing info for the claim.',
                                    additionalProperties: true
                                },
                                source: {
                                    type: 'object',
                                    description: 'Who made or relayed the claim.',
                                    additionalProperties: true,
                                    properties: {
                                        seat: {
                                            anyOf: [
                                                {
                                                    type: 'integer',
                                                    minimum: 1,
                                                    maximum: Math.max(1, playerCount),
                                                    description: 'Source seat number.'
                                                },
                                                { type: 'null', description: 'Unknown seat.' }
                                            ],
                                            description: 'Source seat or null.'
                                        },
                                        name: {
                                            type: 'string',
                                            minLength: 1,
                                            maxLength: 40,
                                            description: 'Source label if seat unknown.'
                                        }
                                    }
                                },
                                subject: {
                                    anyOf: [
                                        {
                                            type: 'object',
                                            description: 'Claim subject if different from source.',
                                            additionalProperties: true,
                                            properties: {
                                                seat: {
                                                    anyOf: [
                                                        {
                                                            type: 'integer',
                                                            minimum: 1,
                                                            maximum: Math.max(1, playerCount),
                                                            description: 'Subject seat number.'
                                                        },
                                                        { type: 'null', description: 'Unknown seat.' }
                                                    ],
                                                    description: 'Subject seat or null.'
                                                },
                                                name: {
                                                    type: 'string',
                                                    minLength: 1,
                                                    maxLength: 40,
                                                    description: 'Subject label if seat unknown.'
                                                }
                                            }
                                        },
                                        { type: 'null', description: 'No distinct subject.' }
                                    ],
                                    description: 'Subject of the claim.'
                                },
                                payload: {
                                    type: 'object',
                                    description: 'Claim-specific data payload.',
                                    additionalProperties: true
                                },
                                confidence: {
                                    type: 'number',
                                    minimum: 0,
                                    maximum: 1,
                                    description: 'Speaker certainty from 0 to 1.'
                                },
                                suspicion: {
                                    type: 'number',
                                    minimum: 0,
                                    maximum: 1,
                                    description: 'Likelihood claim is false/strategic.'
                                },
                                corruption: {
                                    type: 'object',
                                    description: 'Risk of misinformation sources.',
                                    additionalProperties: true,
                                    required: ['poisoned', 'drunk', 'misregistration', 'narrative'],
                                    properties: {
                                        poisoned: {
                                            type: 'number',
                                            minimum: 0,
                                            maximum: 1,
                                            description: 'Chance the source was poisoned.'
                                        },
                                        drunk: {
                                            type: 'number',
                                            minimum: 0,
                                            maximum: 1,
                                            description: 'Chance the source was drunk.'
                                        },
                                        misregistration: {
                                            type: 'number',
                                            minimum: 0,
                                            maximum: 1,
                                            description: 'Chance of misregistration.'
                                        },
                                        narrative: {
                                            type: 'number',
                                            minimum: 0,
                                            maximum: 1,
                                            description: 'Chance this is narrative shaping.'
                                        },
                                        overall: {
                                            anyOf: [
                                                {
                                                    type: 'number',
                                                    minimum: 0,
                                                    maximum: 1,
                                                    description: 'Overall corruption estimate.'
                                                },
                                                { type: 'null', description: 'No overall estimate.' }
                                            ],
                                            description: 'Overall corruption or null.'
                                        }
                                    }
                                },
                                provenance: {
                                    anyOf: [
                                        {
                                            type: 'object',
                                            description: 'Evidence trail for the claim.',
                                            additionalProperties: true,
                                            properties: {
                                                excerpt: {
                                                    type: 'string',
                                                    minLength: 1,
                                                    maxLength: 200,
                                                    description: 'Short quote supporting the claim.'
                                                }
                                            }
                                        },
                                        { type: 'null', description: 'No provenance provided.' }
                                    ],
                                    description: 'Provenance data or null.'
                                }
                            }
                        }
                    }
                }
            },
            reasoning: {
                type: 'string',
                minLength: 1,
                maxLength: 240,
                description: 'Brief notes on extraction choices or ambiguities.'
            }
        }
    })
};
