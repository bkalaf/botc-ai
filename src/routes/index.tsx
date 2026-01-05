// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { TownSquare } from '../components/TownSquare';
import { ISeatedPlayer } from '../store/types/player-types';

export const Route = createFileRoute('/')({ component: App });

function App() {
    const players: ISeatedPlayer[] = [
        {
            ID: 1,
            name: 'Richard',
            role: 'undertaker',
            alignment: 'good',
            isAlive: true,
            team: 'townsfolk',
            hasVote: true,
            personality: {} as any,
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 2,
            name: 'WASHERWOMAN',
            role: 'chef',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: false,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 3,
            name: 'Washerwoman',
            role: 'empath',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 4,
            name: 'Monk',
            role: 'recluse',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 5,
            name: 'Soldier',
            role: 'chef',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 6,
            name: 'SOLDIER',
            role: 'empath',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 7,
            name: 'Bobby',
            role: 'poisoner',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 8,
            name: 'IMP',
            role: 'chef',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 9,
            name: 'RAVENKEEPER',
            role: 'empath',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 10,
            name: 'RAVENKEEPER',
            role: 'imp',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 11,
            name: 'RAVENKEEPER',
            role: 'chef',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 12,
            name: 'RAVENKEEPER',
            role: 'empath',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 13,
            name: 'RAVENKEEPER',
            role: 'baron',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 14,
            name: 'RAVENKEEPER',
            role: 'chef',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        },
        {
            ID: 15,
            name: 'RAVENKEEPER',
            role: 'empath',
            personality: {} as any,
            hasVote: true,
            alignment: 'evil',
            isAlive: true,
            team: 'townsfolk',
            reminders: '',
            isDrunk: false,
            isPoisoned: false
        }
    ];
    return <TownSquare players={players as any}></TownSquare>;
}
