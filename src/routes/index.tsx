// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { TownSquare } from '../components/TownSquare';

export const Route = createFileRoute('/')({ component: App });

function App() {
    const players = [
        { id: '1', name: 'AAAA', role: null },
        { id: '2', name: 'BOBBY', role: 'chef' },
        { id: '3', name: 'CCCCCC', role: 'empath' },
        { id: '4', name: 'AA', role: null },
        { id: '5', name: 'BBBBB', role: 'chef' },
        { id: '6', name: 'Cz', role: 'empath' },
        { id: '7', name: 'AY', role: null },
        { id: '8', name: 'BX', role: 'chef' },
        { id: '9', name: 'CV', role: 'empath' },
        { id: '10', name: 'AU', role: null },
        { id: '11', name: 'BT', role: 'chef' },
        { id: '12', name: 'CM', role: 'empath' },
        { id: '13', name: 'AN', role: null },
        { id: '14', name: 'BO', role: 'chef' },
        { id: '15', name: 'CPc', role: 'empath' }
    ];
    return <TownSquare players={players as any}></TownSquare>;
}
