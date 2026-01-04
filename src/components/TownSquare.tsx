// src/components/TownSquare.tsx
import * as React from 'react';
import tokenImg from './../assets/images/town/token.png';
import chefImg from './../assets/images/chef_e.png';
import empathImg from './../assets/images/empath_g.png';
import { CharacterTokenParent } from './CharacterTokenParent';
import { $$ROLES, CharacterTypes, Roles } from '../data/types';
import { ISeatedPlayer } from '../store/game/game-slice';

// const roleToIcon: Record<Exclude<Role, null>, string> = {
//     chef: chefImg,
//     empath: empathImg
// };

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export function TownSquare({ players }: { players: ISeatedPlayer[] }) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const [layout, setLayout] = React.useState(() => ({
        w: window.innerWidth,
        h: window.innerHeight
    }));

    // Keep responsive
    React.useEffect(() => {
        const onResize = () => setLayout({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const N = clamp(players.length, 5, 20);

    // Big circle sizing rules (tweakable)
    // "goes about 2/3 way to the vertical edge" -> radius relative to width
    // If centerX is 50vw, max to left/right edge is 50vw, 2/3 of that => ~vw/3
    // But we also cap based on height so it doesn’t run off-screen.
    const radius = Math.min(layout.w / 5, layout.h * 0.42);

    // "top edge is about 1/12 of screen away from top"
    const topMargin = layout.h / 20;
    const centerX = layout.w / 2.5;
    const centerY = topMargin + radius;

    // Token size: scales with screen, bounded
    const tokenSize = clamp(Math.min(layout.w, layout.h) * 0.25, 48, 105);

    return (
        <div
            ref={ref}
            className='relative h-full w-full overflow-hidden bg-background'
        >
            {/* Big background circle */}
            <div
                className='absolute rounded-full border bg-white/80 shadow-sm'
                style={{
                    width: radius * 2,
                    height: radius * 2,
                    left: centerX - radius,
                    top: centerY - radius
                }}
            />

            {/* Tokens around circumference */}
            {(players as any[]).slice(0, N).map((p, i) => {
                // Start at top (-90deg) so first token is at 12 o’clock
                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;

                // Place tokens on the rim (slightly outside looks better)
                const ringR = radius - tokenSize * 0.55;
                const x = centerX + ringR * Math.cos(angle) - tokenSize / 2;
                const y = centerY + ringR * Math.sin(angle) - tokenSize / 2;

                const labelId = `token-label-${p.id}-${p.name}`;
                const label = p.name.toUpperCase();
                const isLong = label.length >= 9;
                const targetLen = isLong ? 70 : 76;
                const className = `token-label-svg ${isLong ? 'long' : ''}`;
                console.log(`labelId`, labelId);
                console.log(`label`, label);
                console.log(`isLong`, isLong);
                console.log(`targetLen`, targetLen);
                console.log(`className`, className);
                return (
                    <>
                        <CharacterTokenParent
                            tokenSize={tokenSize}
                            x={x}
                            y={y}
                            role={p.role as any}
                            name={p?.name}
                            seatID={parseInt(p.id, 10)}
                            isAlive={p?.isAlive ?? true}
                            isMarked={false}
                            thinks={undefined}
                            characterType={$$ROLES[p.role as Roles]?.team as CharacterTypes}
                            alignment={'good'}
                        >
                            <img
                                src={tokenImg}
                                alt=''
                                className='absolute inset-0 h-full w-full rounded-full object-cover scale-110'
                                draggable={false}
                            />
                            {p.role ?
                                <img
                                    src={`./../assets/images/${p.role}_${p.alignment === 'good' ? 'g' : 'e'}.png`}
                                    alt={p.role}
                                    className='relative object-contain scale-125'
                                    draggable={false}
                                />
                            :   null}
                        </CharacterTokenParent>
                        {/* <button
                            key={p.id}
                            className='absolute grid place-items-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring'
                            style={{
                                width: tokenSize,
                                height: tokenSize,
                                left: x,
                                top: y
                            }}
                            title={p.name}
                            type='button'
                        > */}
                        {/* Base token */}
                    </>
                );
            })}
        </div>
    );
}
