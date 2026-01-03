// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { TownSquare } from '../components/TownSquare';

export const Route = createFileRoute('/')({ component: App });

function App() {
    const players = [
        { id: '1', name: 'A', role: null },
        { id: '2', name: 'B', role: 'chef' },
        { id: '3', name: 'C', role: 'empath' },
        { id: '4', name: 'A', role: null },
        { id: '5', name: 'B', role: 'chef' },
        { id: '6', name: 'C', role: 'empath' },
        { id: '7', name: 'A', role: null },
        { id: '8', name: 'B', role: 'chef' },
        { id: '9', name: 'C', role: 'empath' },
        { id: '10', name: 'A', role: null },
        { id: '11', name: 'B', role: 'chef' },
        { id: '12', name: 'C', role: 'empath' }
    ];
    return <TownSquare players={players as any}></TownSquare>
}
