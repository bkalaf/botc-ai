// src/components/CircleGrimoire.tsx
import * as React from 'react';
import tokenImg from './../assets/images/town/token.png';
import { CharacterTokenParent } from './CharacterTokenParent';
import { $$ROLES, CharacterTypes, Roles } from '../data/types';
import { ISeatedPlayer } from '../store/types/player-types';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import baronGoodImg from './../assets/images/baron_g.png';
import baronEvilImg from './../assets/images/baron_e.png';
import { useViewControls } from './ViewControlsContext';
import { XIcon } from 'lucide-react';
import butlerGoodImg from './../assets/images/butler_g.png';
import butlerEvilImg from './../assets/images/butler_e.png';
import chefGoodImg from './../assets/images/chef_g.png';
import chefEvilImg from './../assets/images/chef_e.png';
import drunkGoodImg from './../assets/images/drunk_g.png';
import drunkEvilImg from './../assets/images/drunk_e.png';
import empathGoodImg from './../assets/images/empath_g.png';
import empathEvilImg from './../assets/images/empath_e.png';
import fortunetellerGoodImg from './../assets/images/fortuneteller_g.png';
import fortunetellerEvilImg from './../assets/images/fortuneteller_e.png';
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
import poisonerGoodImg from './../assets/images/poisoner_g.png';
import poisonerEvilImg from './../assets/images/poisoner_e.png';
import ravenkeeperGoodImg from './../assets/images/ravenkeeper_g.png';
import ravenkeeperEvilImg from './../assets/images/ravenkeeper_e.png';
import recluseGoodImg from './../assets/images/recluse_g.png';
import recluseEvilImg from './../assets/images/recluse_e.png';
import saintGoodImg from './../assets/images/saint_g.png';
import saintEvilImg from './../assets/images/saint_e.png';
import scarletwomanGoodImg from './../assets/images/scarletwoman_g.png';
import scarletwomanEvilImg from './../assets/images/scarletwoman_e.png';
import slayerGoodImg from './../assets/images/slayer_g.png';
import slayerEvilImg from './../assets/images/slayer_e.png';
import soldierGoodImg from './../assets/images/soldier_g.png';
import soldierEvilImg from './../assets/images/soldier_e.png';
import spyGoodImg from './../assets/images/spy_g.png';
import spyEvilImg from './../assets/images/spy_e.png';
import undertakerGoodImg from './../assets/images/undertaker_g.png';
import undertakerEvilImg from './../assets/images/undertaker_e.png';
import virginGoodImg from './../assets/images/virgin_g.png';
import virginEvilImg from './../assets/images/virgin_e.png';
import washerwomanGoodImg from './../assets/images/washerwoman_g.png';
import washerwomanEvilImg from './../assets/images/washerwoman_e.png';

type ViewSettings = {
    zoom: number;
    offsetX: number;
    offsetY: number;
    topOffset: number;
    ringOffset: number;
    stretch: number;
    tension: number;
    tokenScale: number;
};

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

const DEFAULT_VIEW_SETTINGS: ViewSettings = {
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    topOffset: 0,
    ringOffset: 0,
    stretch: 1,
    tension: 0,
    tokenScale: 1
};

const REMINDER_SLOTS_PER_PLAYER = 5;

type CircleGrimoireProps = {
    players: ISeatedPlayer[];
    nightOrderIndex: {
        first: Record<string, number>;
        other: Record<string, number>;
    };
};

type Layout = {
    w: number;
    h: number;
};

type CircleLayout = {
    radiusX: number;
    radiusY: number;
    centerX: number;
    centerY: number;
    backgroundRadius: number;
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function getCircleLayout(layout: Layout, viewSettings: ViewSettings): CircleLayout {
    const baseRadius = Math.min(layout.w / 5, layout.h * 0.42);
    const baseTopMargin = layout.h / 20;
    const baseCenterX = layout.w / 2.5;

    const radius = baseRadius * viewSettings.zoom;
    const radiusX = radius * viewSettings.stretch;
    const radiusY = radius;
    const topMargin = baseTopMargin * viewSettings.zoom + viewSettings.topOffset;
    const centerX = baseCenterX * viewSettings.zoom + viewSettings.offsetX;
    const centerY = topMargin + radiusY + viewSettings.offsetY;
    const backgroundRadius = clamp(50 - viewSettings.tension * 18, 18, 50);

    return { radiusX, radiusY, centerX, centerY, backgroundRadius };
}

function getTokenSize(layout: Layout, viewSettings: ViewSettings) {
    const baseTokenSize = clamp(Math.min(layout.w, layout.h) * 0.25 * viewSettings.zoom, 48, 160);
    return clamp(baseTokenSize * viewSettings.tokenScale, 48, 220);
}

function buildReminderSlots(
    tokenCenterX: number,
    tokenCenterY: number,
    centerX: number,
    centerY: number,
    tokenSize: number,
    reminderTokenSize: number
) {
    const radialX = tokenCenterX - centerX;
    const radialY = tokenCenterY - centerY;
    const radialLength = Math.hypot(radialX, radialY) || 1;
    const unitRadialX = radialX / radialLength;
    const unitRadialY = radialY / radialLength;
    const reminderStart = tokenSize / 2 + reminderTokenSize * 0.6;
    const reminderSpacing = reminderTokenSize * 0.9;

    return Array.from({ length: REMINDER_SLOTS_PER_PLAYER }, (_, slotIndex) => {
        const distance = reminderStart + slotIndex * reminderSpacing;
        return {
            x: tokenCenterX + unitRadialX * distance - reminderTokenSize / 2,
            y: tokenCenterY + unitRadialY * distance - reminderTokenSize / 2
        };
    });
}

type CircleViewControlsProps = {
    layout: Layout;
    viewSettings: ViewSettings;
    setViewSettings: React.Dispatch<React.SetStateAction<ViewSettings>>;
    controlsPosition: { x: number; y: number };
    setControlsPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    userIdentifier: string;
    setUserIdentifier: React.Dispatch<React.SetStateAction<string>>;
};

function CircleViewControls({
    layout,
    viewSettings,
    setViewSettings,
    controlsPosition,
    setControlsPosition,
    userIdentifier,
    setUserIdentifier
}: CircleViewControlsProps) {
    const controlsRef = React.useRef<HTMLDivElement | null>(null);
    const [isDraggingControls, setIsDraggingControls] = React.useState(false);
    const dragStartRef = React.useRef({ x: 0, y: 0, startX: 0, startY: 0 });
    const { isViewControlsOpen, setIsViewControlsOpen } = useViewControls();
    const shouldUseDrawer = layout.w < 768;

    React.useEffect(() => {
        if (!isDraggingControls) {
            return;
        }

        const handleMove = (event: PointerEvent) => {
            const deltaX = event.clientX - dragStartRef.current.startX;
            const deltaY = event.clientY - dragStartRef.current.startY;
            const rect = controlsRef.current?.getBoundingClientRect();
            const maxX = window.innerWidth - (rect?.width ?? 0) - 8;
            const maxY = window.innerHeight - (rect?.height ?? 0) - 8;
            const nextX = Math.min(Math.max(8, dragStartRef.current.x + deltaX), Math.max(8, maxX));
            const nextY = Math.min(Math.max(8, dragStartRef.current.y + deltaY), Math.max(8, maxY));
            setControlsPosition({
                x: nextX,
                y: nextY
            });
        };

        const handleUp = () => {
            setIsDraggingControls(false);
        };

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp);

        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
        };
    }, [isDraggingControls, setControlsPosition]);

    React.useEffect(() => {
        if (!isViewControlsOpen || !controlsRef.current) {
            return;
        }

        const rect = controlsRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 8;
        const maxY = window.innerHeight - rect.height - 8;
        setControlsPosition((prev) => {
            const nextX = clamp(prev.x, 8, Math.max(8, maxX));
            const nextY = clamp(prev.y, 8, Math.max(8, maxY));
            if (nextX === prev.x && nextY === prev.y) {
                return prev;
            }
            return { x: nextX, y: nextY };
        });
    }, [isViewControlsOpen, layout.w, layout.h, setControlsPosition]);

    const handleControlsPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        setIsDraggingControls(true);
        dragStartRef.current = {
            x: controlsPosition.x,
            y: controlsPosition.y,
            startX: event.clientX,
            startY: event.clientY
        };
    };

    const handleSmoothOut = () => {
        setViewSettings((prev) => ({
            ...prev,
            tension: 0
        }));
    };

    const savePreferences = () => {
        if (typeof window === 'undefined') {
            return;
        }

        let identifier = userIdentifier.trim();
        if (!identifier) {
            const response = window.prompt('Enter your email or name to save these settings:');
            if (!response) {
                return;
            }
            identifier = response.trim();
            if (!identifier) {
                return;
            }
            setUserIdentifier(identifier);
        }

        const payload = {
            identifier,
            viewSettings,
            controlsPosition,
            savedAt: new Date().toISOString()
        };

        const raw = window.localStorage.getItem('townSquarePreferences');
        let existing: Record<string, typeof payload> = {};
        if (raw) {
            try {
                existing = JSON.parse(raw) as Record<string, typeof payload>;
            } catch {
                existing = {};
            }
        }
        existing[identifier] = payload;
        window.localStorage.setItem('townSquarePreferences', JSON.stringify(existing));
        window.localStorage.setItem('townSquarePreferences:lastUser', identifier);

        const safeIdentifier = identifier.replace(/[^a-z0-9-_]+/gi, '_');
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `town-square-preferences-${safeIdentifier}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const renderViewControlsGrid = (className?: string) => (
        <div className={['grid grid-cols-2 gap-2', className].filter(Boolean).join(' ')}>
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
                        ringOffset: prev.ringOffset - 12
                    }))
                }
            >
                Tokens In
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
                        stretch: clamp(prev.stretch - 0.1, 0.8, 1.8)
                    }))
                }
            >
                Stretch -
            </Button>
            <Button
                size='sm'
                variant='outline'
                type='button'
                onClick={() =>
                    setViewSettings((prev) => ({
                        ...prev,
                        stretch: clamp(prev.stretch + 0.1, 0.8, 1.8)
                    }))
                }
            >
                Stretch +
            </Button>
            <Button
                size='sm'
                variant='outline'
                type='button'
                onClick={() =>
                    setViewSettings((prev) => ({
                        ...prev,
                        tension: clamp(prev.tension - 0.05, 0, 0.6)
                    }))
                }
            >
                Tension -
            </Button>
            <Button
                size='sm'
                variant='outline'
                type='button'
                onClick={() =>
                    setViewSettings((prev) => ({
                        ...prev,
                        tension: clamp(prev.tension + 0.05, 0, 0.6)
                    }))
                }
            >
                Tension +
            </Button>
            <Button
                size='sm'
                variant='outline'
                type='button'
                onClick={() =>
                    setViewSettings((prev) => ({
                        ...prev,
                        tokenScale: clamp(prev.tokenScale - 0.05, 0.7, 1.6)
                    }))
                }
            >
                Token Size -
            </Button>
            <Button
                size='sm'
                variant='outline'
                type='button'
                onClick={() =>
                    setViewSettings((prev) => ({
                        ...prev,
                        tokenScale: clamp(prev.tokenScale + 0.05, 0.7, 1.6)
                    }))
                }
            >
                Token Size +
            </Button>
            <Button
                size='sm'
                variant='outline'
                type='button'
                onClick={handleSmoothOut}
                className='col-span-2'
            >
                Smooth Out
            </Button>
            <Button
                size='sm'
                variant='secondary'
                type='button'
                onClick={() => setViewSettings(DEFAULT_VIEW_SETTINGS)}
                className='col-span-2'
            >
                Reset
            </Button>
            <Button
                size='sm'
                variant='default'
                type='button'
                onClick={savePreferences}
                className='col-span-2'
            >
                Save Preferences
            </Button>
        </div>
    );

    return (
        <>
            {isViewControlsOpen && !shouldUseDrawer ?
                <div
                    ref={controlsRef}
                    className='absolute z-20 hidden w-[280px] flex-col overflow-hidden rounded-md border bg-white/95 text-sm shadow-lg backdrop-blur md:flex'
                    style={{ left: controlsPosition.x, top: controlsPosition.y }}
                >
                    <div
                        className='flex cursor-move select-none items-center justify-between border-b border-border/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-foreground'
                        onPointerDown={handleControlsPointerDown}
                        style={{ touchAction: 'none' }}
                    >
                        <div className='flex flex-col gap-0.5 text-left'>
                            <span>View Controls</span>
                            <span className='text-[10px] font-normal normal-case text-muted-foreground'>Drag</span>
                        </div>
                        <Button
                            size='icon-sm'
                            variant='ghost'
                            type='button'
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={() => setIsViewControlsOpen(false)}
                            aria-label='Dismiss view controls'
                        >
                            <XIcon className='h-3.5 w-3.5' />
                        </Button>
                    </div>
                    {renderViewControlsGrid('p-3')}
                </div>
            :   null}
            {shouldUseDrawer ?
                <Drawer
                    open={isViewControlsOpen}
                    onOpenChange={setIsViewControlsOpen}
                >
                    <DrawerContent>
                        <DrawerHeader className='flex-row items-center justify-between'>
                            <div className='flex flex-col gap-0.5 text-left'>
                                <DrawerTitle>View Controls</DrawerTitle>
                                <span className='text-[11px] text-muted-foreground'>Swipe down to close</span>
                            </div>
                            <DrawerClose asChild>
                                <Button
                                    size='icon-sm'
                                    variant='ghost'
                                    type='button'
                                    aria-label='Dismiss view controls'
                                >
                                    <XIcon className='h-3.5 w-3.5' />
                                </Button>
                            </DrawerClose>
                        </DrawerHeader>
                        {renderViewControlsGrid('px-4 pb-6')}
                    </DrawerContent>
                </Drawer>
            :   null}
        </>
    );
}

export function CircleGrimoire({ players, nightOrderIndex }: CircleGrimoireProps) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const [layout, setLayout] = React.useState<Layout>(() => ({
        w: window.innerWidth,
        h: window.innerHeight
    }));
    const [controlsPosition, setControlsPosition] = React.useState({ x: 16, y: 16 });
    const [userIdentifier, setUserIdentifier] = React.useState('');
    const [viewSettings, setViewSettings] = React.useState(DEFAULT_VIEW_SETTINGS);

    const N = clamp(players.length, 5, 20);

    React.useEffect(() => {
        const onResize = () => setLayout({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const storedUser = window.localStorage.getItem('townSquarePreferences:lastUser');
        if (storedUser) {
            setUserIdentifier(storedUser);
        }

        const raw = window.localStorage.getItem('townSquarePreferences');
        if (!raw || !storedUser) {
            return;
        }

        try {
            const parsed = JSON.parse(raw) as Record<
                string,
                { viewSettings: ViewSettings; controlsPosition: typeof controlsPosition }
            >;
            const saved = parsed[storedUser];
            if (saved?.viewSettings) {
                setViewSettings(saved.viewSettings);
            }
            if (saved?.controlsPosition) {
                setControlsPosition(saved.controlsPosition);
            }
        } catch {
            return;
        }
    }, []);

    const circleLayout = getCircleLayout(layout, viewSettings);
    const tokenSize = getTokenSize(layout, viewSettings);

    return (
        <div
            ref={ref}
            className='relative h-full w-full overflow-hidden bg-background'
        >
            <CircleViewControls
                layout={layout}
                viewSettings={viewSettings}
                setViewSettings={setViewSettings}
                controlsPosition={controlsPosition}
                setControlsPosition={setControlsPosition}
                userIdentifier={userIdentifier}
                setUserIdentifier={setUserIdentifier}
            />

            {/* Big background circle */}
            <div
                className='absolute border bg-white/80 shadow-sm'
                style={{
                    width: circleLayout.radiusX * 2,
                    height: circleLayout.radiusY * 2,
                    left: circleLayout.centerX - circleLayout.radiusX,
                    top: circleLayout.centerY - circleLayout.radiusY,
                    borderRadius: `${circleLayout.backgroundRadius}%`
                }}
            />

            {/* Tokens around circumference */}
            {(players as any[]).slice(0, N).map((p, i) => {
                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;

                const ringRx = circleLayout.radiusX - tokenSize * 0.55 + viewSettings.ringOffset;
                const ringRy = circleLayout.radiusY - tokenSize * 0.55 + viewSettings.ringOffset;
                const cornerBoost = 1 + viewSettings.tension * Math.pow(Math.abs(Math.sin(2 * angle)), 2);
                const x = circleLayout.centerX + ringRx * cornerBoost * Math.cos(angle) - tokenSize / 2;
                const y = circleLayout.centerY + ringRy * cornerBoost * Math.sin(angle) - tokenSize / 2;
                const tokenCenterX = x + tokenSize / 2;
                const tokenCenterY = y + tokenSize / 2;
                const reminderTokenSize = clamp(tokenSize * 0.35, 18, 52);
                const reminderSlots = buildReminderSlots(
                    tokenCenterX,
                    tokenCenterY,
                    circleLayout.centerX,
                    circleLayout.centerY,
                    tokenSize,
                    reminderTokenSize
                );

                const roleKey = p.role as keyof typeof roleToIcon;
                const iconEntry = roleKey ? roleToIcon[roleKey] : undefined;
                const img =
                    iconEntry ?
                        p.alignment === 'good' ?
                            iconEntry[0]
                        :   iconEntry[1]
                    :   undefined;

                const characterType = $$ROLES[p.role as Roles]?.team as CharacterTypes;
                const alignment = p?.alignment ?? 'good';
                return (
                    <CharacterTokenParent
                        key={p.id}
                        tokenSize={tokenSize}
                        x={x}
                        y={y}
                        role={p.role as Roles}
                        name={p?.name}
                        seatID={parseInt(p.id, 10)}
                        data-is-alive={p?.isAlive ?? true}
                        data-is-dead={!(p?.isAlive ?? true)}
                        data-is-marked={false}
                        thinks={undefined}
                        data-character-type={characterType}
                        data-alignment={'good'}
                        isAlive={p?.isAlive ?? true}
                        characterType={characterType}
                        alignment={alignment}
                        firstNightOrder={nightOrderIndex.first[p.role as Roles] ?? 0}
                        otherNightOrder={nightOrderIndex.other[p.role as Roles] ?? 0}
                        reminderSlots={reminderSlots}
                        reminderTokenSize={reminderTokenSize}
                    >
                        <img
                            src={tokenImg}
                            alt=''
                            className='absolute inset-0 h-full w-full rounded-full object-cover scale-110 z-0'
                            draggable={false}
                        />
                        {p.role && img ?
                            <img
                                src={img}
                                alt={p.role}
                                className='z-0 relative object-contain scale-125'
                                draggable={false}
                            />
                        :   null}
                    </CharacterTokenParent>
                );
            })}
        </div>
    );
}
