import dawnBreaksImg from '@/assets/images/dawn-breaks.jpeg';

import { GameOverlay } from './GameOverlay';

type OverlayDialogProps = {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function DawnBreaksDialog({ open, onOpenChange }: OverlayDialogProps) {
    return (
        <GameOverlay
            open={open}
            onOpenChange={onOpenChange}
            title='Dawn Breaks'
            description='Wake up. The day phase begins.'
            imageSrc={dawnBreaksImg}
            imageAlt='Sunrise'
        >
            <p className='text-center text-base text-slate-100'>
                Please open your eyes and discuss the night’s events.
            </p>
        </GameOverlay>
    );
}
