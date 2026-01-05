// src/components/CharacterTokenBase.tsx
import tokenPng from './../assets/images/town/token.png';
import lifePng from './../assets/images/town/life.png';
import deathPng from './../assets/images/town/death.png';

export function TokenBase({ pngSrc, alt, className }: { className?: string; alt: string; pngSrc: string }) {
    const classes = [
        'absolute inset-0 h-full w-full rounded-full object-cover scale-110 z-0',
        ...(className ? [className] : [])
    ].join(' ');
    return (
        <img
            src={pngSrc}
            alt={alt}
            className={classes}
            draggable={false}
        />
    );
}
export const CharacterTokenBase = () => (
    <TokenBase
        className='group-data-[alive-state="dead"]:hidden'
        pngSrc={tokenPng}
        alt='Character'
    />
);
export const LifeTokenBase = () => (
    <TokenBase
        className='group-data-[alive-state="dead"]:hidden'
        pngSrc={lifePng}
        alt='Character'
    />
);
export const DeathTokenBase = () => (
    <TokenBase
        className='group-data-[alive-state="alive"]:hidden'
        pngSrc={deathPng}
        alt='Character'
    />
);
