// src/prompts/createPrompt.ts
import { InputSchema, PromptSpec } from './prompt-types';
import { toMdTable } from './markdownTable';
import z from 'zod';
import { toProperCase } from '../utils/getWordsForNumber.ts/toProperCase';

export function createPrompt(
    promptSpec: PromptSpec,
    { extractedSeats, outOfPlay, demonBluffs, nightNumber, phase }: z.infer<typeof InputSchema>
) {
    const {
        goal,
        guidelines,
        id,
        input,
        instructions,
        output,
        perspective,
        additionalConsiderations,
        footnote,
        quote,
        deviations,
        inputs,
        personalityModulation,
        title,
        tags,
        schema
    } = promptSpec;

    const addBullet = (s: string) => `* ${s}`;
    const personalityMod = (title: string, obj?: Record<string, string>) =>
        obj ? [toProperCase(title), ...Object.entries(obj).map(([k, v]) => addBullet(`${k}: ${v}`))] : [];
    const result = [
        'INSTRUCTIONS:',
        instructions.join(' '),
        '',
        'GUIDELINES:',
        ...guidelines.map((str, ix) => `${(ix + 1).toString()}. ${str}`),
        ...(footnote ? [footnote, ''] : ['']),
        'GOAL:',
        goal,
        '',
        ...(additionalConsiderations ?
            ['ADDITIONAL CONSIDERATIONS:', ...(additionalConsiderations ?? []).map(addBullet)]
        :   []),
        ...(deviations ?
            ['DEVIATIONS FROM STANDARD STORYTELLER CONSIDERATION:', ...deviations.map(addBullet), '']
        :   ['']),
        ...(personalityModulation ?
            [
                'PERSONALITY MODULATION:',
                'Your decision must reflect the following personality traits:',
                ...personalityMod('TRUST MODEL', personalityModulation?.trustModel),
                ...personalityMod('TABLE IMPACT', personalityModulation?.tableImpact),
                ...personalityMod('REASONING MODE', personalityModulation?.reasoningMode),
                ...personalityMod('INFORMATION HANDLING', personalityModulation?.informationHandling),
                ...personalityMod('VOICE STYLE', personalityModulation?.voiceStyle),
                ''
            ]
        :   []),
        'INPUT:',
        ...input.map(addBullet),
        ...(inputs?.map(addBullet) ?? []),
        '',
        'OUTPUT:',
        JSON.stringify(output, null, '\t'),
        '',
        'STATE:',
        toMdTable(extractedSeats as any),
        ...(outOfPlay ? ['OUT OF PLAY: '.concat(outOfPlay.join(', '))] : []),
        ...(demonBluffs ? ['DEMON BLUFFS: '.concat(demonBluffs.join(', '))] : []),
        ...(nightNumber ? [`IT IS ${phase.toUpperCase()} NUMBER ${nightNumber.toString()}`] : []),
        'FINAL NOTE: The first column of the table is the SEAT number. Player # may appear as a generic name in the 2nd column. These values are not interchangable. SEAT # is a 0 based index.'
    ];

    return result.join('\n');
}
