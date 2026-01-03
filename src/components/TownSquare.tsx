// src/components/TownSquare.tsx
import * as React from 'react';
import tokenImg from './../assets/images/town/token.png';
import chefImg from './../assets/images/chef_g.png';
import empathImg from './../assets/images/empath_g.png';

type Role = 'chef' | 'empath' | null;

type Player = {
    id: string;
    name: string;
    role: Role;
};

const roleToIcon: Record<Exclude<Role, null>, string> = {
    chef: chefImg,
    empath: empathImg
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export function TownSquare({ players }: { players: Player[] }) {
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
    const radius = Math.min(layout.w / 5.75, layout.h * 0.42);

    // "top edge is about 1/12 of screen away from top"
    const topMargin = layout.h / 12;
    const centerX = layout.w / 2;
    const centerY = topMargin + radius;

    // Token size: scales with screen, bounded
    const tokenSize = clamp(Math.min(layout.w, layout.h) * 0.085, 48, 92);

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
            {players.slice(0, N).map((p, i) => {
                // Start at top (-90deg) so first token is at 12 o’clock
                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;

                // Place tokens on the rim (slightly outside looks better)
                const ringR = radius;
                const x = centerX + ringR * Math.cos(angle) - tokenSize / 2;
                const y = centerY + ringR * Math.sin(angle) - tokenSize / 2;

                return (
                    <button
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
                    >
                        {/* Base token */}
                        <img
                            src={tokenImg}
                            alt=''
                            className='absolute inset-0 h-full w-full rounded-full object-cover'
                            draggable={false}
                        />

                        {/* Role icon overlay (if assigned) */}
                        {p.role ?
                            <img
                                src={roleToIcon[p.role]}
                                alt={p.role}
                                className='relative h-[70%] w-[70%] object-contain'
                                draggable={false}
                            />
                        :   null}
                    </button>
                );
            })}
        </div>
    );
}
