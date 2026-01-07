//src/prompts/markdownTable.ts
import { markdownTable } from 'markdown-table';
import { toProperCase } from '../utils/stringUtils';

const headers = [
    'seatID',
    'player',
    'team',
    'characterType',
    'role',
    'perceivedAs',
    'isAlive',
    'hasVote',
    'isDrunk',
    'isPoisoned',
    'reminderTokens'
];

export function toMdTable(rawData: IExtractedSeat[]) {
    return markdownTable([
        headers.map((h) => toProperCase(h).toUpperCase()), // Header row
        ...rawData.map((obj) => headers.map((key) => String(obj[key as keyof typeof obj] ?? ''))) // Data rows
    ]);
}
