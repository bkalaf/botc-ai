// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { TownSquare } from '../components/TownSquare';
import { ISeatedPlayer } from '../store/game/game-slice';

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
            hasVote: true
        },
        { id: '2', name: 'WASHERWOMAN', role: 'chef' },
        { id: '3', name: 'Washerwoman', role: 'empath' },
        { id: '4', name: 'Monk', role: 'recluse' },
        { id: '5', name: 'Soldier', role: 'chef' },
        { id: '6', name: 'SOLDIER', role: 'empath' },
        { id: '7', name: 'SPY', role: 'saint' },
        { id: '8', name: 'IMP', role: 'chef', isAlive: false },
        { id: '9', name: 'RAVENKEEPER', role: 'empath' },
        { id: '10', name: 'RAVENKEEPER', role: 'imp' },
        { id: '11', name: 'RAVENKEEPER', role: 'chef' },
        { id: '12', name: 'RAVENKEEPER', role: 'empath' },
        { id: '13', name: 'RAVENKEEPER', role: 'baron' },
        { id: '14', name: 'RAVENKEEPER', role: 'chef' },
        { id: '15', name: 'RAVENKEEPER', role: 'empath' }
    ];
    return <TownSquare players={players as any}></TownSquare>;
}
