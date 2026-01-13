// src/prompts/markdownTable.ts
//src/prompts/markdownTable.ts
import { markdownTable } from 'markdown-table';
import { toProperCase } from '../utils/getWordsForNumber.ts/toProperCase';
import { ISeatedPlayer } from '../store/types/player-types';
import { Claim } from '../store/types/memory-types';

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
const Heads = [
    'SEAT #',
    'Name',
    'Alignment',
    'Character Type',
    'Role',
    'Thinks they are',
    'Alive',
    'Has Vote',
    'Is Drunk',
    'Is Poisoned',
    'Reminder Tokens'
];

export function toMdTable(rawData: ISeatedPlayer[]) {
    return markdownTable([
        headers.map((h, ix) => Heads[ix]), // Header row
        ...rawData.map((obj) => headers.map((key) => String(obj[key as keyof typeof obj] ?? ''))) // Data rows
    ]);
}

const claimHeaders = ['infoType', 'role', 'team', 'seat', 'source', 'day', 'data'];
const ClaimsHeads = ['Info Type', 'Role', 'Team', 'Seat', 'Source', 'Day', 'Data'];
export function toClaimsMdTable(rawData: Claim[]) {
    return markdownTable([
        headers.map((h, ix) => ClaimsHeads[ix]), // Header row
        ...rawData.map((obj) => claimHeaders.map((key) => String(obj[key as keyof typeof obj] ?? ''))) // Data rows
    ]);
}
