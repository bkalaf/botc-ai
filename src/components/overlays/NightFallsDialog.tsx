import nightFallsImg from '@/assets/images/night-falls.jpg';

import { GameOverlay } from './GameOverlay';

type OverlayDialogProps = {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function NightFallsDialog({ open, onOpenChange }: OverlayDialogProps) {
    return (
        <GameOverlay
            open={open}
            onOpenChange={onOpenChange}
            title='Night Falls'
            description='Close your eyes. The night phase has begun.'
            imageSrc={nightFallsImg}
            imageAlt='Night sky'
        >
            <p className='text-center text-base text-slate-200'>
                Minions and demons, keep your heads down until called.
            </p>
        </GameOverlay>
    );
}
