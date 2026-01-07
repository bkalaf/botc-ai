// src/prompts/prompt-types.ts
import { Personality } from '../store/types/player-types';
import z from 'zod';

/** Maps each trait -> option -> behavioral instruction text. */
export type PersonalityModulation = Partial<{
    [K in keyof Personality]: Partial<Record<Personality[K], string>>;
}>;

/**
 * JSON Schema-ish (Draft-07 compatible enough for most validators).
 * Keep it broad so you can plug in Ajv / zod-to-json-schema / custom validation.
 */
export type JsonSchema = {
    $schema?: string;
    title?: string;
    description?: string;
    type?: string | string[];
    properties?: Record<string, JsonSchema>;
    required?: string[];
    additionalProperties?: boolean;
    items?: JsonSchema | JsonSchema[];
    enum?: any[];
    const?: any;
    minimum?: number;
    maximum?: number;
    maxItems?: number;
    minItems?: number;
    oneOf?: JsonSchema[];
    anyOf?: JsonSchema[];
    allOf?: JsonSchema[];
};
/**
 * PromptSpec: a single spec that supports both Storyteller prompts and AI player prompts.
 * Intentional design goals:
 * - Stable top-level keys across prompts
 * - Consistent IO: always use `input` and `output` (but we still allow legacy `inputs`)
 * - Optional `schema` to validate model output
 */
export type PromptSpec = {
    // ---------- metadata ----------
    id: string;
    version?: string;
    title?: string;
    tags?: string[];
    perspective: 'storyteller' | 'player' | 'generic';

    // ---------- core blocks ----------
    instructions: string[];
    guidelines: string[];
    footnote?: string;
    quote?: string[];

    // ---------- decision framing ----------
    goal: string;
    additionalConsiderations?: string[];
    deviations?: string[];

    // ---------- player-only ----------
    personalityModulation?: PersonalityModulation;

    // ---------- IO ----------
    /** Preferred. */
    input: string[];
    /** Legacy alias; keep for backward compat if you have old code reading `inputs`. */
    inputs?: string[];

    /**
     * Output fields as a schema-ish description map (human-readable).
     * This is what your existing prompt files most naturally store.
     */
    output: Record<string, string> | { fields: Record<string, string>; notes?: string | string[] };

    /**
     * Machine-checkable schema for model output. Strongly recommended.
     * This should match the real JSON you expect from the model.
     */
    schema?: JsonSchema;
};

export const ExtractSeatInput = z.object({
    seatID: z.int(),
    player: z.string(),
    team: z.enum(['good', 'evil']),
    characterType: z.enum(['townsfolk', 'outsider', 'minion', 'demon', 'traveler', 'fabled', 'loric']),
    role: z.string(),
    perceivedAs: z.string().optional(),
    isAlive: z.boolean().default(true),
    hasVote: z.boolean().default(true),
    isDrunk: z.boolean().default(false),
    isPoisoned: z.boolean().default(false),
    reminderTokens: z.string(),
    name: z.string(),
    abilityText: z.string()
});

export const rolesSchema = z.enum([
    'imp',
    'scarletwoman',
    'spy',
    'baron',
    'poisoner',
    'saint',
    'recluse',
    'drunk',
    'butler',
    'monk',
    'empath',
    'fortuneteller',
    'undertaker',
    'virgin',
    'librarian',
    'investigator',
    'washerwoman',
    'chef',
    'mayor',
    'slayer',
    'soldier',
    'ravenkeeper',
    'gardener',
    'bootlegger',
    'gunslinger',
    'beggar',
    'scapegoat',
    'thief',
    'bureaucrat',
    'spiritofivory',
    'sentinel',
    'fibbin'
]);

export const InputSchema = z.object({
    extractedSeats: z.array(ExtractSeatInput),
    demonBluffs: z.array(z.string()),
    outOfPlay: z.array(rolesSchema),
    nightNumber: z.int(),
    phase: z.enum(['day', 'night'])
});
