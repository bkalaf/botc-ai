// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { TownSquare } from '../components/TownSquare';

export const Route = createFileRoute('/')({ component: App });

function App() {
    const players = [
        { id: '1', name: 'UNDERTAKER', role: null },
        { id: '2', name: 'WASHERWOMAN', role: 'chef' },
        { id: '3', name: 'Washerwoman', role: 'empath' },
        { id: '4', name: 'Monk', role: null },
        { id: '5', name: 'Soldier', role: 'chef' },
        { id: '6', name: 'SOLDIER', role: 'empath' },
        { id: '7', name: 'SPY', role: null },
        { id: '8', name: 'IMP', role: 'chef', isAlive: false },
        { id: '9', name: 'RAVENKEEPER', role: 'empath' },
        { id: '10', name: 'RAVENKEEPER', role: null },
        { id: '11', name: 'RAVENKEEPER', role: 'chef' },
        { id: '12', name: 'RAVENKEEPER', role: 'empath' },
        { id: '13', name: 'RAVENKEEPER', role: null },
        { id: '14', name: 'RAVENKEEPER', role: 'chef' },
        { id: '15', name: 'RAVENKEEPER', role: 'empath' }
    ];
    return <TownSquare players={players as any}></TownSquare>;
}
