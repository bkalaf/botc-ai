// src/data/types.ts
import editions from './editions.json';
import fabled from './fabled.json';
import jinxes from './hatred.json';
import roles from './roles.json';
import officialCounts from './game.json';

export type CharacterTokens = {
    id: Roles;
    name: string;
    edition: Editions;
    team: CharacterTypes;
    firstNight: number;
    firstNightReminder: string;
    otherNight: number;
    otherNightReminder: string;
    reminders: string[];
    setup: boolean;
    ability: string;
};
export type Jinxes = {
    id: string;
    hatred: {
        id: string;
        reason: string;
    }[];
};
export type CharacterCounts = { townsfolk: number; outsider: number; demon: number; minion: number }[];
export type CharacterTypes = 'townsfolk' | 'outsider' | 'minion' | 'demon' | 'traveler' | 'loric' | 'fabled';
export type Editions = 'tb' | 'bmr' | 'snv';
export type Roles =
    | 'washerwoman'
    | 'librarian'
    | 'investigator'
    | 'chef'
    | 'empath'
    | 'monk'
    | 'undertaker'
    | 'ravenkeeper'
    | 'undertaker'
    | 'mayor'
    | 'soldier'
    | 'slayer'
    | 'fortuneteller'
    | 'saint'
    | 'recluse'
    | 'butler'
    | 'drunk'
    | 'scarletwoman'
    | 'spy'
    | 'baron'
    | 'poisoner'
    | 'imp';

