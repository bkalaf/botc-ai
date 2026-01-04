// src/utils/getWordsForNumber.ts/toProperCase.ts
const ACRONYMS = new Set(['ID', 'URL', 'HTML', 'CSS', 'API', 'JSON']);

/**
 * Converts camelCase or PascalCase strings into Proper Case.
 */
export const toProperCase = (input: string): string => {
    return input
        .replace(/(?<=[a-zA-Z])(?=[0-9])/g, '-')
        .replace(/(?<=[a-z])(?=[A-Z])|(?<=[0-9])(?=[a-zA-Z])/g, ' ')
        .split(' ')
        .map((word) => {
            const upper = word.toUpperCase();
            // If the word (or the word without the hyphen) is a known acronym
            return ACRONYMS.has(upper) || ACRONYMS.has(word.split('-')[0].toUpperCase()) ?
                    upper
                :   word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ')
        .trim();
};
