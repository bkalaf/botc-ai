// src/prompts/claimsExtractor.ts
import { PromptSpec } from './prompt-types';

export const claimExtractor: PromptSpec = {
    id: 'system-claim-extractor',
    version: '1.0',
    title: 'Conversation → Claims Extractor',
    tags: ['botc', 'system', 'nlp', 'claims'],
    perspective: 'generic',

    instructions: [
        `You are a structured information extraction system for Blood on the Clocktower conversations.`,
        `Your job is to convert raw conversation text into structured Claim objects.`,
        `Extract claims about roles, information results, outsider counts, demon/minion types, actions, and world theories.`,
        `When someone repeats or relays another person’s claim, record the original source seat if known, and set reportedBySeat to the current speaker if provided.`,
        `Assign confidence (speaker certainty) and suspicion (likelihood it is false/strategic) as numbers 0..1.`,
        `Assign corruption risks (poisoned/drunk/misregistration/narrative) as numbers 0..1.`
    ],

    guidelines: [
        `TIMING: Use provided day/night/phase unless the text clearly references a different time ("last night", "Day 1").`,
        `SEAT MAPPING: Prefer seat numbers when available. If only names exist, keep seat null and use label.`,
        `CLAIM KIND: Choose the most specific kind possible (role, info_result, outsider_count, demon_type, minion_type, action, world_model).`,
        `EVIDENCE: Include a short excerpt in provenance.excerpt for traceability.`,
        `CONSERVATIVE EXTRACTION: If unsure whether something is a claim vs idle chatter, either omit or mark low confidence.`,
        `DON’T INVENT: Do not fabricate roles, numbers, or times not present or implied.`
    ],

    goal: `Extract structured claims from conversation messages.`,

    input: [
        `Batch of conversation messages (speaker seat, text, visibility, day/night/phase)`,
        `Optional seating/name mapping`,
        `Optional script roles list (for role normalization)`
    ],

    output: {
        shown: 'object: { claims: Claim[] } (claims extracted from the conversation)',
        reasoning: 'Short description of extraction choices and any ambiguities handled.'
    },

    schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'ClaimExtractorOutput',
        type: 'object',
        additionalProperties: false,
        required: ['shown', 'reasoning'],
        properties: {
            shown: {
                type: 'object',
                additionalProperties: false,
                required: ['claims'],
                properties: {
                    claims: {
                        type: 'array',
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
                                id: { type: 'string' },
                                kind: { type: 'string' },
                                visibility: { type: 'string' },
                                timing: { type: 'object' },
                                source: { type: 'object' },
                                subject: { type: ['object', 'null'] },
                                payload: { type: 'object' },
                                confidence: { type: 'number', minimum: 0, maximum: 1 },
                                suspicion: { type: 'number', minimum: 0, maximum: 1 },
                                corruption: {
                                    type: 'object',
                                    additionalProperties: true,
                                    required: ['poisoned', 'drunk', 'misregistration', 'narrative'],
                                    properties: {
                                        poisoned: { type: 'number', minimum: 0, maximum: 1 },
                                        drunk: { type: 'number', minimum: 0, maximum: 1 },
                                        misregistration: { type: 'number', minimum: 0, maximum: 1 },
                                        narrative: { type: 'number', minimum: 0, maximum: 1 },
                                        overall: { type: ['number', 'null'], minimum: 0, maximum: 1 }
                                    }
                                },
                                provenance: { type: ['object', 'null'] }
                            }
                        }
                    }
                }
            },
            reasoning: { type: 'string' }
        }
    }
};
