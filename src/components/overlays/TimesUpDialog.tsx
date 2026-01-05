import clockImg from '@/assets/images/town/clock-big.png';

import { GameOverlay } from './GameOverlay';

type OverlayDialogProps = {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function TimesUpDialog({ open, onOpenChange }: OverlayDialogProps) {
    return (
        <GameOverlay
            open={open}
            onOpenChange={onOpenChange}
            title="Time's Up"
            description='The allotted time has ended.'
            imageSrc={clockImg}
            imageAlt='Clock face'
        >
            <p className='text-center text-lg font-semibold text-amber-100'>Please return to the town square.</p>
        </GameOverlay>
    );
}
