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
    const [layout, setLayout] = React.useState({ w: 0, h: 0 });

    // Measure the actual available space (accounts for sidebar/topbar/bottombar)
    React.useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const ro = new ResizeObserver(([entry]) => {
            const cr = entry.contentRect;
            setLayout({ w: cr.width, h: cr.height });
        });

        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const N = clamp(players.length, 5, 18);

    // If not measured yet, render an empty container (avoids NaNs)
    if (layout.w === 0 || layout.h === 0) {
        return (
            <div
                ref={ref}
                className='h-full w-full'
            />
        );
    }

    // Circle sizing:
    // - "halfway to vertical edges from center" => width/4
    // - cap by height so it doesn't run off-screen
    const radius = Math.min(layout.w / 4, layout.h * 0.42);

    // "top edge about 1/12 down from top"
    const topMargin = layout.h / 12;
    const centerX = layout.w / 2;
    const centerY = topMargin + radius;

    // Token size: scales with available space
    const tokenSize = clamp(Math.min(layout.w, layout.h) * 0.095, 54, 104);

    const spacingFactor = (() => {
        if (N >= 18) return 1;
        if (N <= 15) return 1.06;
        const t = (18 - N) / 3;
        return 1 + 0.06 * t;
    })();

    // Place tokens on the rim; adjust to control spacing between tokens
    const minRingR = (tokenSize * spacingFactor) / (2 * Math.sin(Math.PI / N));
    const ringR = Math.min(radius, minRingR);

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
                const x = centerX + ringR * Math.cos(angle) - tokenSize / 2;
                const y = centerY + ringR * Math.sin(angle) - tokenSize / 2;

                // Unique id for SVG path references
                const labelId = `token-label-${p.id}`;

                return (
                    <button
                        key={p.id}
                        type='button'
                        aria-label={p.name}
                        className='
              absolute grid place-items-center rounded-full border-0 overflow-visible
              outline-none focus:outline-none
              focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
            '
                        style={{ width: tokenSize, height: tokenSize, left: x, top: y }}
                    >
                        <div className='relative h-full w-full overflow-visible'>
                            {/* Base token */}
                            <img
                                src={tokenImg}
                                alt=''
                                draggable={false}
                                className='
                  absolute inset-0 h-full w-full z-0
                  rounded-full object-cover
                  scale-[1.68] origin-center
                  drop-shadow-md
                '
                            />

                            {/* Role icon */}
                            {p.role && (
                                <img
                                    src={roleToIcon[p.role]}
                                    alt={p.role}
                                    draggable={false}
                                    className='absolute inset-0 m-auto z-10
                    h-[80%] w-[80%]
                    object-contain
                    scale-[2.4] origin-center
                    pointer-events-none'
                                />
                            )}

                            <div className='pointer-events-none absolute inset-0 z-20'>
                                <svg
                                    viewBox='0 0 100 100'
                                    className='absolute inset-0'
                                    aria-hidden='true'
                                >
                                    <path
                                        id={labelId}
                                        d='M 14 80 Q 50 92 86 80'
                                        fill='none'
                                    />
                                    <text className={`token-label-svg ${p.name.length > 10 ? 'long' : ''}`}>
                                        <textPath
                                            href={`#${labelId}`}
                                            startOffset='50%'
                                            textAnchor='middle'
                                        >
                                            {p.name.toUpperCase()}
                                        </textPath>
                                    </text>
                                </svg>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
