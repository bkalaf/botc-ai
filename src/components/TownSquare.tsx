// src/components/TownSquare.tsx
import * as React from 'react';
import tokenImg from './../assets/images/town/token.png';
import { CharacterTokenParent } from './CharacterTokenParent';
import { $$ROLES, CharacterTypes, Roles } from '../data/types';
import { ISeatedPlayer } from '../store/game/game-slice';
import { Button } from '@/components/ui/button';
import baronGoodImg from './../assets/images/baron_g.png';
import baronEvilImg from './../assets/images/baron_e.png';
// import beggarGoodImg from './../assets/images/beggar_g.png';
// import beggarEvilImg from './../assets/images/beggar_e.png';
// import beggarImg from './../assets/images/beggar.png';
// import bootleggerGoodImg from './../assets/images/bootlegger.png';
// import bureaucratImg from './../assets/images/bureaucrat.png';
// import bureaucratEvilImg from './../assets/images/bureaucrat_e.png';
// import bureaucratGoodImg from './../assets/images/bureaucrat_g.png';
import butlerGoodImg from './../assets/images/butler_g.png';
import butlerEvilImg from './../assets/images/butler_e.png';
import chefGoodImg from './../assets/images/chef_g.png';
import chefEvilImg from './../assets/images/chef_e.png';
// import dawnGoodImg from './../assets/images/dawn-breaks';
import drunkGoodImg from './../assets/images/drunk_g.png';
import drunkEvilImg from './../assets/images/drunk_e.png';
import empathGoodImg from './../assets/images/empath_g.png';
import empathEvilImg from './../assets/images/empath_e.png';
// import fibbinImg from './../assets/images/fibbin.png';
import fortunetellerGoodImg from './../assets/images/fortuneteller_g.png';
import fortunetellerEvilImg from './../assets/images/fortuneteller_e.png';
// import gardenerImg from './../assets/images/gardener.png';
// import gunslingerGoodImg from './../assets/images/gunslinger_g.png';
// import gunslingerEvilImg from './../assets/images/gunslinger_e.png';
// import gunslingerImg from './../assets/images/gunslinger.png';
import impGoodImg from './../assets/images/imp_g.png';
import impEvilImg from './../assets/images/imp_e.png';
import investigatorGoodImg from './../assets/images/investigator_g.png';
import investigatorEvilImg from './../assets/images/investigator_e.png';
import librarianGoodImg from './../assets/images/librarian_g.png';
import librarianEvilImg from './../assets/images/librarian_e.png';
import mayorGoodImg from './../assets/images/mayor_g.png';
import mayorEvilImg from './../assets/images/mayor_e.png';
import monkGoodImg from './../assets/images/monk_g.png';
import monkEvilImg from './../assets/images/monk_e.png';
// import nightGoodImg from './../assets/images/night-falls';
import poisonerGoodImg from './../assets/images/poisoner_g.png';
import poisonerEvilImg from './../assets/images/poisoner_e.png';
import ravenkeeperGoodImg from './../assets/images/ravenkeeper_g.png';
import ravenkeeperEvilImg from './../assets/images/ravenkeeper_e.png';
import recluseGoodImg from './../assets/images/recluse_g.png';
import recluseEvilImg from './../assets/images/recluse_e.png';
import saintGoodImg from './../assets/images/saint_g.png';
import saintEvilImg from './../assets/images/saint_e.png';
// import scapegoatGoodImg from './../assets/images/scapegoat_g.png';
// import scapegoatEvilImg from './../assets/images/scapegoat_e.png';
// import scapegoatImg from './../assets/images/scapegoat.png';
import scarletwomanGoodImg from './../assets/images/scarletwoman_g.png';
import scarletwomanEvilImg from './../assets/images/scarletwoman_e.png';
// import sentinelImg from './../assets/images/sentinel.png';
import slayerGoodImg from './../assets/images/slayer_g.png';
import slayerEvilImg from './../assets/images/slayer_e.png';
import soldierGoodImg from './../assets/images/soldier_g.png';
import soldierEvilImg from './../assets/images/soldier_e.png';
// import spiritofivoryImg from './../assets/images/spiritofivory.png';
import spyGoodImg from './../assets/images/spy_g.png';
import spyEvilImg from './../assets/images/spy_e.png';
// import thiefImg from './../assets/images/thief.png';
// import thiefEvilImg from './../assets/images/thief_e.png';
// import thiefGoodImg from './../assets/images/thief_g.png';
import undertakerGoodImg from './../assets/images/undertaker_g.png';
import undertakerEvilImg from './../assets/images/undertaker_e.png';
import virginGoodImg from './../assets/images/virgin_g.png';
import virginEvilImg from './../assets/images/virgin_e.png';
import washerwomanGoodImg from './../assets/images/washerwoman_g.png';
import washerwomanEvilImg from './../assets/images/washerwoman_e.png';

const roleToIcon: Record<Roles, [any, any?]> = {
    empath: [empathGoodImg, empathEvilImg],
    undertaker: [undertakerGoodImg, undertakerEvilImg],
    chef: [chefGoodImg, chefEvilImg],
    librarian: [librarianGoodImg, librarianEvilImg],
    investigator: [investigatorGoodImg, investigatorEvilImg],
    washerwoman: [washerwomanGoodImg, washerwomanEvilImg],
    slayer: [slayerGoodImg, slayerEvilImg],
    soldier: [soldierGoodImg, soldierEvilImg],
    virgin: [virginGoodImg, virginEvilImg],
    spy: [spyGoodImg, spyEvilImg],
    scarletwoman: [scarletwomanGoodImg, scarletwomanEvilImg],
    baron: [baronGoodImg, baronEvilImg],
    poisoner: [poisonerGoodImg, poisonerEvilImg],
    imp: [impGoodImg, impEvilImg],
    recluse: [recluseGoodImg, recluseEvilImg],
    saint: [saintGoodImg, saintEvilImg],
    ravenkeeper: [ravenkeeperGoodImg, ravenkeeperEvilImg],
    monk: [monkGoodImg, monkEvilImg],
    mayor: [mayorGoodImg, mayorEvilImg],
    fortuneteller: [fortunetellerGoodImg, fortunetellerEvilImg],
    drunk: [drunkGoodImg, drunkEvilImg],
    butler: [butlerGoodImg, butlerEvilImg]
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export function TownSquare({ players }: { players: ISeatedPlayer[] }) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const [layout, setLayout] = React.useState(() => ({
        w: window.innerWidth,
        h: window.innerHeight
    }));
    const [viewSettings, setViewSettings] = React.useState({
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
        topOffset: 0,
        ringOffset: 0
    });

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
    const baseRadius = Math.min(layout.w / 5, layout.h * 0.42);

    // "top edge is about 1/12 of screen away from top"
    const baseTopMargin = layout.h / 20;
    const baseCenterX = layout.w / 2.5;

    const radius = baseRadius * viewSettings.zoom;
    const topMargin = baseTopMargin * viewSettings.zoom + viewSettings.topOffset;
    const centerX = baseCenterX * viewSettings.zoom + viewSettings.offsetX;
    const centerY = topMargin + radius + viewSettings.offsetY;

    // Token size: scales with screen, bounded
    const tokenSize = clamp(
        Math.min(layout.w, layout.h) * 0.25 * viewSettings.zoom,
        48,
        130
    );

    return (
        <div
            ref={ref}
            className='relative h-full w-full overflow-hidden bg-background'
        >
            <div className='absolute left-4 top-4 z-20 flex flex-col gap-2 rounded-md bg-white/90 p-3 text-sm shadow'>
                <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                    View Controls
                </div>
                <div className='flex flex-wrap gap-2'>
                    <Button
                        size='sm'
                        variant='outline'
                        type='button'
                        onClick={() =>
                            setViewSettings((prev) => ({
                                ...prev,
                                zoom: clamp(prev.zoom + 0.05, 0.7, 1.6)
                            }))
                        }
                    >
                        Zoom In
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        type='button'
                        onClick={() =>
                            setViewSettings((prev) => ({
                                ...prev,
                                zoom: clamp(prev.zoom - 0.05, 0.7, 1.6)
                            }))
                        }
                    >
                        Zoom Out
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        type='button'
                        onClick={() =>
                            setViewSettings((prev) => ({
                                ...prev,
                                offsetX: prev.offsetX - 16
                            }))
                        }
                    >
                        Left
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        type='button'
                        onClick={() =>
                            setViewSettings((prev) => ({
                                ...prev,
                                offsetX: prev.offsetX + 16
                            }))
                        }
                    >
                        Right
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        type='button'
                        onClick={() =>
                            setViewSettings((prev) => ({
                                ...prev,
                                offsetY: prev.offsetY - 16
                            }))
                        }
                    >
                        Up
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        type='button'
                        onClick={() =>
                            setViewSettings((prev) => ({
                                ...prev,
                                offsetY: prev.offsetY + 16
                            }))
                        }
                    >
                        Down
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        type='button'
                        onClick={() =>
                            setViewSettings((prev) => ({
                                ...prev,
                                topOffset: prev.topOffset + 12
                            }))
                        }
                    >
                        Top Margin +
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        type='button'
                        onClick={() =>
                            setViewSettings((prev) => ({
                                ...prev,
                                topOffset: prev.topOffset - 12
                            }))
                        }
                    >
                        Top Margin -
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        type='button'
                        onClick={() =>
                            setViewSettings((prev) => ({
                                ...prev,
                                ringOffset: prev.ringOffset + 12
                            }))
                        }
                    >
                        Tokens Out
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        type='button'
                        onClick={() =>
                            setViewSettings((prev) => ({
                                ...prev,
                                ringOffset: prev.ringOffset - 12
                            }))
                        }
                    >
                        Tokens In
                    </Button>
                    <Button
                        size='sm'
                        variant='secondary'
                        type='button'
                        onClick={() =>
                            setViewSettings({
                                zoom: 1,
                                offsetX: 0,
                                offsetY: 0,
                                topOffset: 0,
                                ringOffset: 0
                            })
                        }
                    >
                        Reset
                    </Button>
                </div>
            </div>
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
                const ringR = radius - tokenSize * 0.55 + viewSettings.ringOffset;
                const x = centerX + ringR * Math.cos(angle) - tokenSize / 2;
                const y = centerY + ringR * Math.sin(angle) - tokenSize / 2;

                const labelId = `token-label-${p.id}-${p.name}`;
                const label = p.name.toUpperCase();
                const isLong = label.length >= 9;
                const targetLen = isLong ? 70 : 76;
                const className = `token-label-svg ${isLong ? 'long' : ''}`;
                const image = `./../assets/images/${p.role}_${p.alignment === 'good' ? 'g' : 'e'}.png`;
                const img = (
                    p.alignment === 'good' ?
                        roleToIcon[p.role as any as keyof typeof roleToIcon][0]
                    :   roleToIcon[p.role as any as keyof typeof roleToIcon][1]) as any;
                // const cc = {};
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
                                className='absolute inset-0 h-full w-full rounded-full object-cover scale-110 z-0'
                                draggable={false}
                            />
                            {p.role ?
                                <img
                                    src={img}
                                    alt={p.role}
                                    className='z-10 relative object-contain scale-125'
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
