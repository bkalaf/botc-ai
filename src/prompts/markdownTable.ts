// src/prompts/markdownTable.ts
//src/prompts/markdownTable.ts
import { markdownTable } from 'markdown-table';
import { toProperCase } from '../utils/getWordsForNumber.ts/toProperCase';
import { ISeatedPlayer } from '../store/types/player-types';

const headers = [
    'ID',
    'name',
    'alignment',
    'team',
    'role',
    'thinks',
    'isAlive',
    'hasVote',
    'isDrunk',
    'isPoisoned',
    'reminders'
];

export function toMdTable(rawData: ISeatedPlayer[]) {
    return markdownTable([
        headers.map((h) => toProperCase(h).toUpperCase()), // Header row
        ...rawData.map((obj) => headers.map((key) => String(obj[key as keyof typeof obj] ?? ''))) // Data rows
    ]);
}
