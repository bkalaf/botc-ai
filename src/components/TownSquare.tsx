// src/components/TownSquare.tsx
import * as React from 'react';
import tokenImg from './../assets/images/town/token.png';
import { CharacterTokenParent } from './CharacterTokenParent';
import { $$ROLES, CharacterTypes, Roles } from '../data/types';
import { selectScript } from '../store/game/game-slice';
import { ISeatedPlayer } from '../store/types/player-types';
import { useAppSelector } from '@/store/hooks';
import { buildNightOrderIndex } from '../utils/nightOrder';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import baronGoodImg from './../assets/images/baron_g.png';
import baronEvilImg from './../assets/images/baron_e.png';
import { useViewControls } from './ViewControlsContext';
import { XIcon } from 'lucide-react';
import { selectGrimoireShape } from '@/store/settings/settings-slice';
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
import { hasWindow } from './hasWindow';
import { EvilTokens, GoodTokens } from './Tokens';
import { selectDemonBluffs } from '../store/grimoire/grimoire-slice';

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

function estimateEllipseCircumference(radiusX: number, radiusY: number) {
    const a = Math.max(radiusX, radiusY);
    const b = Math.min(radiusX, radiusY);
    if (a <= 0 || b <= 0) {
        return 0;
    }

    return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
}

function tap(Func?: () => React.JSX.Element) {
    if (Func) {
        return Func();
    }
    return null;
}

type ViewSettings = {
    zoom: number;
    offsetX: number;
    offsetY: number;
    topOffset: number;
    ringOffset: number;
    stretch: number;
    tension: number;
    tokenScale: number;
    cornerSpacingFactor: number;
};

const defaultViewSettings: ViewSettings = {
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    topOffset: 0,
    ringOffset: 0,
    stretch: 1,
    tension: 0,
    tokenScale: 1,
    cornerSpacingFactor: 1.7
};

type SeatPosition = {
    x: number;
    y: number;
    reminderSlots: Array<{ x: number; y: number }>;
    reminderTokenSize: number;
};

const buildReminderSlots = ({
    tokenCenterX,
    tokenCenterY,
    outwardX,
    outwardY,
    tokenSize,
    reminderTokenSize,
    reminderSlotsPerPlayer
}: {
    tokenCenterX: number;
    tokenCenterY: number;
    outwardX: number;
    outwardY: number;
    tokenSize: number;
    reminderTokenSize: number;
    reminderSlotsPerPlayer: number;
}) => {
    const length = Math.hypot(outwardX, outwardY) || 1;
    const unitX = outwardX / length;
    const unitY = outwardY / length;
    const reminderStart = tokenSize / 2 + reminderTokenSize * 0.6;
    const reminderSpacing = reminderTokenSize * 0.9;
    return Array.from({ length: reminderSlotsPerPlayer }, (_, slotIndex) => {
        const distance = reminderStart + slotIndex * reminderSpacing;
        return {
            x: tokenCenterX + unitX * distance - reminderTokenSize / 2,
            y: tokenCenterY + unitY * distance - reminderTokenSize / 2
        };
    });
};

const getCircleSeatPositions = ({
    count,
    centerX,
    centerY,
    radiusX,
    radiusY,
    tokenSize,
    ringOffset,
    tension,
    reminderSlotsPerPlayer
}: {
    count: number;
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    tokenSize: number;
    ringOffset: number;
    tension: number;
    reminderSlotsPerPlayer: number;
}): SeatPosition[] => {
    const reminderTokenSize = clamp(tokenSize * 0.7, 18, 160);
    const ringRx = radiusX - tokenSize * 0.55 + ringOffset;
    const ringRy = radiusY - tokenSize * 0.55 + ringOffset;

    return Array.from({ length: count }, (_, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
        const cornerBoost = 1 + tension * Math.pow(Math.abs(Math.sin(2 * angle)), 2);
        const x = centerX + ringRx * cornerBoost * Math.cos(angle) - tokenSize / 2;
        const y = centerY + ringRy * cornerBoost * Math.sin(angle) - tokenSize / 2;
        const tokenCenterX = x + tokenSize / 2;
        const tokenCenterY = y + tokenSize / 2;
        const reminderSlots = buildReminderSlots({
            tokenCenterX,
            tokenCenterY,
            outwardX: tokenCenterX - centerX,
            outwardY: tokenCenterY - centerY,
            tokenSize,
            reminderTokenSize,
            reminderSlotsPerPlayer
        });
        return {
            x,
            y,
            reminderSlots,
            reminderTokenSize
        };
    });
};

const getSquareSeatPositions = ({
    count,
    centerX,
    centerY,
    halfWidth,
    halfHeight,
    tokenSize,
    ringOffset,
    reminderSlotsPerPlayer
}: {
    count: number;
    centerX: number;
    centerY: number;
    halfWidth: number;
    halfHeight: number;
    tokenSize: number;
    ringOffset: number;
    reminderSlotsPerPlayer: number;
}): SeatPosition[] => {
    const reminderTokenSize = clamp(tokenSize * 0.7, 18, 160);
    const maxRingHalfX = Math.max(0, halfWidth - tokenSize / 2);
    const maxRingHalfY = Math.max(0, halfHeight - tokenSize / 2);
    const ringHalfX = clamp(maxRingHalfX + ringOffset, 0, maxRingHalfX);
    const ringHalfY = clamp(maxRingHalfY + ringOffset, 0, maxRingHalfY);

    if (ringHalfX <= 0 || ringHalfY <= 0 || count <= 1) {
        return Array.from({ length: count }, () => {
            const reminderSlots = buildReminderSlots({
                tokenCenterX: centerX,
                tokenCenterY: centerY,
                outwardX: 0,
                outwardY: 1,
                tokenSize,
                reminderTokenSize,
                reminderSlotsPerPlayer
            });
            return {
                x: centerX - tokenSize / 2,
                y: centerY - tokenSize / 2,
                reminderSlots,
                reminderTokenSize
            };
        });
    }

    const width = ringHalfX * 2;
    const height = ringHalfY * 2;
    const perimeter = 2 * (width + height);
    const step = perimeter / count;
    const startOffset = width / 2;

    return Array.from({ length: count }, (_, index) => {
        const distance = (startOffset + index * step) % perimeter;
        let seatX = centerX - ringHalfX;
        let seatY = centerY - ringHalfY;

        if (distance <= width) {
            seatX = centerX - ringHalfX + distance;
            seatY = centerY - ringHalfY;
        } else if (distance <= width + height) {
            seatX = centerX + ringHalfX;
            seatY = centerY - ringHalfY + (distance - width);
        } else if (distance <= width + height + width) {
            seatX = centerX + ringHalfX - (distance - width - height);
            seatY = centerY + ringHalfY;
        } else {
            seatX = centerX - ringHalfX;
            seatY = centerY + ringHalfY - (distance - width - height - width);
        }

        const reminderSlots = buildReminderSlots({
            tokenCenterX: seatX,
            tokenCenterY: seatY,
            outwardX: centerX - seatX,
            outwardY: centerY - seatY,
            tokenSize,
            reminderTokenSize,
            reminderSlotsPerPlayer
        });
        return {
            x: seatX - tokenSize / 2,
            y: seatY - tokenSize / 2,
            reminderSlots,
            reminderTokenSize
        };
    });
};

export function TownSquare({ players }: { players: ISeatedPlayer[] }) {
    const script = useAppSelector(selectScript);
    const grimoireShape = useAppSelector(selectGrimoireShape);
    const ref = React.useRef<HTMLDivElement | null>(null);
    const controlsRef = React.useRef<HTMLDivElement | null>(null);
    const { isViewControlsOpen, setIsViewControlsOpen } = useViewControls();
    const [layout, setLayout] = React.useState(() =>
        hasWindow() ?
            {
                w: window.innerWidth,
                h: window.innerHeight
            }
        :   { w: 0, h: 0 }
    );
    const [controlsPosition, setControlsPosition] = React.useState({ x: 16, y: 16 });
    const [isDraggingControls, setIsDraggingControls] = React.useState(false);
    const dragStartRef = React.useRef({ x: 0, y: 0, startX: 0, startY: 0 });
    const [userIdentifier, setUserIdentifier] = React.useState('');
    const [viewSettings, setViewSettings] = React.useState<ViewSettings>(defaultViewSettings);
    const inPlayRoles = React.useMemo(
        () => players.map((player) => player.thinks ?? player.role).filter((role): role is Roles => Boolean(role)),
        [players]
    );
    const activeRoles = React.useMemo(() => {
        const merged = [...inPlayRoles];
        return Array.from(new Set(merged));
    }, [inPlayRoles]);
    const nightOrderIndex = React.useMemo(
        () => ({
            first: buildNightOrderIndex(activeRoles, 'firstNight'),
            other: buildNightOrderIndex(activeRoles, 'otherNight')
        }),
        [activeRoles]
    );

    // Keep responsive
    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const element = ref.current;
        if (!element) {
            return;
        }

        const updateLayout = () => {
            const rect = element.getBoundingClientRect();
            setLayout({ w: rect.width, h: rect.height });
        };

        updateLayout();

        if (typeof ResizeObserver !== 'undefined') {
            const observer = new ResizeObserver(updateLayout);
            observer.observe(element);
            return () => observer.disconnect();
        }

        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
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
                { viewSettings: typeof viewSettings; controlsPosition: typeof controlsPosition }
            >;
            const saved = parsed[storedUser];
            if (saved?.viewSettings) {
                setViewSettings({ ...defaultViewSettings, ...saved.viewSettings });
            }
            if (saved?.controlsPosition) {
                setControlsPosition(saved.controlsPosition);
            }
        } catch {
            return;
        }
    }, []);

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
    }, [isDraggingControls]);

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
    }, [isViewControlsOpen, layout.w, layout.h]);

    const N = clamp(players.length, 5, 20);
    const reminderSlotsPerPlayer = 5;
    const layoutWidth = Math.max(layout.w, 1);
    const layoutHeight = Math.max(layout.h, 1);
    const minLayout = Math.min(layoutWidth, layoutHeight);
    const isSquare = grimoireShape === 'square';
    const shouldUseDrawer = layoutWidth < 768;

    // Big circle sizing rules (tweakable)
    // "goes about 2/3 way to the vertical edge" -> radius relative to width
    // If centerX is 50vw, max to left/right edge is 50vw, 2/3 of that => ~vw/3
    // But we also cap based on height so it doesn’t run off-screen.
    const baseRadius = Math.min(layoutWidth / 5, layoutHeight * 0.42);

    // "top edge is about 1/12 of screen away from top"
    const baseTopMargin = layoutHeight / 20;
    const baseCenterX = layoutWidth / 2.5;

    const circleRadius = baseRadius * viewSettings.zoom;
    const circleRadiusX = circleRadius * viewSettings.stretch;
    const circleRadiusY = circleRadius;
    const circleTopMargin = baseTopMargin * viewSettings.zoom + viewSettings.topOffset;
    const circleCenterX = baseCenterX * viewSettings.zoom + viewSettings.offsetX;
    const circleCenterY = circleTopMargin + circleRadiusY + viewSettings.offsetY;
    const backgroundRadius = clamp(50 - viewSettings.tension * 18, 18, 50);

    const sideMarginX = layoutWidth * 0.2;
    const rectAvailableWidth = Math.max(0, layoutWidth - sideMarginX * 2);
    const rectAvailableHeight = layoutHeight;
    const rectWidth = clamp(rectAvailableWidth * viewSettings.zoom, 0, rectAvailableWidth);
    const rectHeight = clamp(rectAvailableHeight * viewSettings.zoom, 0, rectAvailableHeight);
    const rectHalfWidth = rectWidth / 2;
    const rectHalfHeight = rectHeight / 2;
    const rectCenterX = clamp(
        layoutWidth / 2 + viewSettings.offsetX,
        sideMarginX + rectHalfWidth,
        layoutWidth - sideMarginX - rectHalfWidth
    );
    const rectCenterY = clamp(
        layoutHeight / 2 + viewSettings.offsetY + viewSettings.topOffset,
        rectHalfHeight,
        layoutHeight - rectHalfHeight
    );
    const rectPerimeter = rectWidth + rectHeight > 0 ? 2 * (rectWidth + rectHeight) : 0;
    const rectTokenMaxFromCorners = rectPerimeter > 0 ? rectPerimeter / (N * viewSettings.cornerSpacingFactor + 4) : 0;
    const rectTokenMax = Math.min(220, rectTokenMaxFromCorners);
    const rectTokenMin = Math.min(32, rectTokenMax);

    // Token size: scales with screen, bounded
    const circleBaseTokenSize = clamp(minLayout * 0.25 * viewSettings.zoom, 32, 160);
    const circleRingRx = Math.max(circleRadiusX - circleBaseTokenSize * 0.55 + viewSettings.ringOffset, 1);
    const circleRingRy = Math.max(circleRadiusY - circleBaseTokenSize * 0.55 + viewSettings.ringOffset, 1);
    const circleCircumference = estimateEllipseCircumference(circleRingRx, circleRingRy);
    const circleTokenMaxFromCircumference =
        circleCircumference > 0 ?
            Math.max(32, circleCircumference / (N * 1.1))
        :   circleBaseTokenSize * viewSettings.tokenScale;
    const circleTokenMax = Math.min(220, circleTokenMaxFromCircumference);
    const circleTokenSize = clamp(circleBaseTokenSize * viewSettings.tokenScale, 32, circleTokenMax);
    const rectBaseTokenSize = clamp(Math.min(rectWidth, rectHeight) * 0.25, rectTokenMin, 160);
    const rectTokenSize = clamp(rectBaseTokenSize * viewSettings.tokenScale, rectTokenMin, rectTokenMax);
    const tokenSize = isSquare ? rectTokenSize : circleTokenSize;
    const seatPositions = React.useMemo(() => {
        if (isSquare) {
            return getSquareSeatPositions({
                count: N,
                centerX: rectCenterX,
                centerY: rectCenterY,
                halfWidth: rectHalfWidth,
                halfHeight: rectHalfHeight,
                tokenSize,
                ringOffset: viewSettings.ringOffset,
                reminderSlotsPerPlayer
            });
        }

        return getCircleSeatPositions({
            count: N,
            centerX: circleCenterX,
            centerY: circleCenterY,
            radiusX: circleRadiusX,
            radiusY: circleRadiusY,
            tokenSize,
            ringOffset: viewSettings.ringOffset,
            tension: viewSettings.tension,
            reminderSlotsPerPlayer
        });
    }, [
        N,
        circleCenterX,
        circleCenterY,
        circleRadiusX,
        circleRadiusY,
        rectCenterX,
        rectCenterY,
        rectHalfWidth,
        rectHalfHeight,
        tokenSize,
        viewSettings.ringOffset,
        viewSettings.tension,
        reminderSlotsPerPlayer,
        isSquare
    ]);

    const demonBluffsTokenSize = clamp(Math.min(layoutWidth, layoutHeight) * 0.12, 28, 60);

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
        <div className={['grid grid-cols-2 gap-2 bg-background', className].filter(Boolean).join(' ')}>
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
                onClick={() =>
                    setViewSettings((prev) => ({
                        ...prev,
                        cornerSpacingFactor: clamp(prev.cornerSpacingFactor - 0.1, 1.1, 2.4)
                    }))
                }
            >
                Corner Gap -
            </Button>
            <Button
                size='sm'
                variant='outline'
                type='button'
                onClick={() =>
                    setViewSettings((prev) => ({
                        ...prev,
                        cornerSpacingFactor: clamp(prev.cornerSpacingFactor + 0.1, 1.1, 2.4)
                    }))
                }
            >
                Corner Gap +
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
                onClick={() => setViewSettings(defaultViewSettings)}
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
        <div
            ref={ref}
            className='relative h-full w-full overflow-hidden bg-background'
        >
            {isViewControlsOpen && !shouldUseDrawer ?
                <div
                    ref={controlsRef}
                    className='bg-background absolute z-20 hidden w-[280px] flex-col overflow-hidden rounded-md border text-sm shadow-lg backdrop-blur md:flex'
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
                    <DrawerContent className='bg-background'>
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
            <DemonBluffsDisplay tokenSize={demonBluffsTokenSize} />
            {/* Big background shape */}
            <div
                className='absolute bg-transparent'
                style={{
                    width: isSquare ? rectWidth : circleRadiusX * 2,
                    height: isSquare ? rectHeight : circleRadiusY * 2,
                    left: isSquare ? rectCenterX - rectHalfWidth : circleCenterX - circleRadiusX,
                    top: isSquare ? rectCenterY - rectHalfHeight : circleCenterY - circleRadiusY,
                    borderRadius: isSquare ? '0%' : `${backgroundRadius}%`
                }}
            />

            {/* Tokens around circumference */}
            {(players as any[]).slice(0, N).map((p, i) => {
                const seat = seatPositions[i];
                if (!seat) {
                    return null;
                }

                const roleKey = p.role as keyof typeof roleToIcon;
                const iconEntry = roleKey ? roleToIcon[(p.thinks as Roles) ?? (p.role as Roles)] : undefined;
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
                        x={seat.x}
                        y={seat.y}
                        role={p.role as Roles}
                        name={p?.name}
                        seatID={parseInt(p.id, 10)}
                        data-is-alive={p?.isAlive ?? true}
                        data-is-dead={!(p?.isAlive ?? true)}
                        data-is-marked={false}
                        thinks={p?.thinks}
                        data-character-type={characterType}
                        data-alignment={'good'}
                        isAlive={p?.isAlive ?? true}
                        characterType={characterType}
                        alignment={alignment}
                        firstNightOrder={nightOrderIndex.first[p.role as Roles] ?? 0}
                        otherNightOrder={nightOrderIndex.other[p.role as Roles] ?? 0}
                        reminderSlots={seat.reminderSlots}
                        reminderTokenSize={seat.reminderTokenSize}
                        reminderTokens={(p as ISeatedPlayer).reminderTokens}
                    >
                        <img
                            src={img}
                            alt={p.role}
                            className='absolute inset-0 h-full w-full rounded-full object-cover scale-110 z-10 border-2 border-white'
                            draggable={false}
                        />
                    </CharacterTokenParent>
                );
            })}
        </div>
    );
}

type DemonBluffsDisplayProps = {
    tokenSize: number;
};

function DemonBluffsDisplay({ tokenSize }: DemonBluffsDisplayProps) {
    const demonBluffs = useAppSelector(selectDemonBluffs);
    return (
        <div className='absolute top-4 left-4 z-20 flex flex-col gap-1 rounded-lg border border-border/70 bg-background/80 px-3 py-2 text-[11px] font-semibold text-muted-foreground shadow-lg shadow-black/40 backdrop-blur'>
            <span className='text-[10px] uppercase tracking-[0.25em]'>Demon Bluffs</span>
            <div className='flex gap-2 flex-col'>
                {Array.from({ length: 3 }, (_, index) => {
                    const iconEntry =
                        demonBluffs ?
                            demonBluffs[index] ?
                                roleToIcon[demonBluffs[index]]
                            :   undefined
                        :   undefined;
                    const icon = iconEntry ? iconEntry[0] : undefined;
                    return (
                        <div
                            key={index}
                            data-demon-bluff-token={index}
                            className='flex relative items-center justify-center rounded-full border border-border/60 bg-gradient-to-br from-red-800 via-red-950 to-black shadow-inner'
                            style={{ width: tokenSize, height: tokenSize }}
                        >
                            <img
                                src={icon}
                                className='absolute inset-0 h-full w-full rounded-full object-cover scale-110 z-10 border-2 border-white'
                                draggable={false}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
