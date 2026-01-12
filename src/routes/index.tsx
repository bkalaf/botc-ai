// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { TownSquare } from '../components/TownSquare';
import { useAppSelector } from '../store/hooks';
import { selectSeatedPlayers } from '../store/grimoire/grimoire-slice';
import { TimesUpDialog } from '../components/overlays/TimesUpDialog';
import { DawnBreaksDialog } from '../components/overlays/DawnBreaksDialog';
import { NightFallsDialog } from '../components/overlays/NightFallsDialog';
import { GameOverlay } from '../components/overlays/GameOverlay';

export const Route = createFileRoute('/')({ component: App });

function App() {
    const players = useAppSelector(selectSeatedPlayers);

    return (
        <>
            <TownSquare players={players as any}></TownSquare>
            <TimesUpDialog />
            <DawnBreaksDialog />
            <NightFallsDialog />
            <GameOverlay />
        </>
    );
}
