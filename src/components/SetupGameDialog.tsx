// src/components/SetupGameDialog.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectScript } from '@/store/game/game-slice';
import { setSeats } from '@/store/grimoire/grimoire-slice';
import { enqueueBack } from '@/store/st-queue/st-queue-slice';
import { IPlayer, ISeat, Personality } from '@/store/types/player-types';
import { CharacterCounts, CharacterTokens, CharacterTypes, Roles } from '@/data/types';
import namesJson from '@/data/names.json';
import rolesData from '@/data/roles.json';
import gameDefinitions from '@/data/game.json';

type NameEntry = { name: string; pronouns: 'he/him' | 'she/her' | 'they/them' };

const buildNamePool = (): NameEntry[] => [
    ...namesJson.boys.map((name) => ({ name, pronouns: 'he/him' as const })),
    ...namesJson.girls.map((name) => ({ name, pronouns: 'she/her' as const })),
    ...namesJson.unisex.map((name) => ({ name, pronouns: 'they/them' as const }))
];

const shuffleArray = <T,>(items: T[]): T[] => {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const randomFrom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const trustModels: Personality['trustModel'][] = [
    'all_trusting',
    'cautiously_trusting',
    'skeptical',
    'guarded',
    'doubting_thomas'
];

const tableImpacts: Personality['tableImpact'][] = [
    'disruptive',
    'provocative',
    'stabilizing',
    'organized',
    'procedural'
];

const reasoningModes: Personality['reasoningMode'][] = [
    'deductive',
    'systematic',
    'associative',
    'intuitive',
    'surface'
];

const informationHandlingStyles: Personality['informationHandling'][] = [
    'archivist',
    'curator',
    'impressionistic',
    'triage',
    'signal_driven'
];

const voiceStyles: Personality['voiceStyle'][] = ['quiet', 'reserved', 'conversational', 'assertive', 'dominant'];

const buildRandomPersonality = (): Personality => ({
    trustModel: randomFrom(trustModels),
    tableImpact: randomFrom(tableImpacts),
    reasoningMode: randomFrom(reasoningModes),
    informationHandling: randomFrom(informationHandlingStyles),
    voiceStyle: randomFrom(voiceStyles)
});

const normalizeTeam = (team: CharacterTypes): CharacterTypes =>
    team === 'traveler' || team === 'loric' || team === 'fabled' ? 'townsfolk' : team;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const characterCounts = gameDefinitions as CharacterCounts;

export function SetupGameDialog() {
    const script = useAppSelector(selectScript);
    const dispatch = useAppDispatch();
    const hasScript = script.length > 0;
    const [isOpen, setIsOpen] = React.useState(false);
    const [aiPlayers, setAiPlayers] = React.useState(0);
    const [humanPlayers, setHumanPlayers] = React.useState(0);
    const [humanNames, setHumanNames] = React.useState<string[]>([]);
    const baseNamePool = React.useMemo(() => buildNamePool(), []);
    const [lastNamePool, setLastNamePool] = React.useState<NameEntry[]>(baseNamePool);
    const [hasSubmittedSetup, setHasSubmittedSetup] = React.useState(false);

    const pronounLookup = React.useMemo(() => {
        const map = new Map<string, string>();
        namesJson.boys.forEach((name) => map.set(name.toLowerCase(), 'he/him'));
        namesJson.girls.forEach((name) => map.set(name.toLowerCase(), 'she/her'));
        namesJson.unisex.forEach((name) => map.set(name.toLowerCase(), 'they/them'));
        return map;
    }, []);

    React.useEffect(() => {
        setHumanNames((prev) => {
            const next = prev.slice(0, humanPlayers);
            while (next.length < humanPlayers) {
                next.push('');
            }
            return next;
        });
    }, [humanPlayers]);

    const resetForm = React.useCallback(() => {
        setAiPlayers(0);
        setHumanPlayers(0);
        setHumanNames([]);
        setHasSubmittedSetup(false);
    }, []);

    React.useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    const totalPlayers = aiPlayers + humanPlayers;
    const isPlayerCountValid = totalPlayers >= 5 && totalPlayers <= 15;
    const areNamesValid =
        humanPlayers <= 0 || (humanNames.length === humanPlayers && humanNames.every((name) => name.trim().length > 0));
    const isFormValid = hasScript && isPlayerCountValid && areNamesValid;

    const handleAiPlayersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = Math.max(0, Math.min(15, Math.floor(Number(event.target.value) || 0)));
        setAiPlayers(next);
    };

    const handleHumanPlayersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = Math.max(0, Math.min(15, Math.floor(Number(event.target.value) || 0)));
        setHumanPlayers(next);
    };

    const handleHumanNameChange = (index: number, value: string) => {
        setHumanNames((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const labelForNameField = (index: number) => `Human player #${index + 1} name`;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isFormValid) {
            return;
        }

        const trimmedHumanNames = humanNames.slice(0, humanPlayers).map((name) => name.trim());
        const humanSet = new Set(trimmedHumanNames.map((name) => name.toLowerCase()));
        const namePoolAfterHumans = baseNamePool.filter((entry) => !humanSet.has(entry.name.toLowerCase()));

        const randomizedNamePool = shuffleArray(namePoolAfterHumans);
        const aiNameEntries = randomizedNamePool.slice(0, aiPlayers);
        const namesUsedLower = new Set([
            ...trimmedHumanNames.map((name) => name.toLowerCase()),
            ...aiNameEntries.map((entry) => entry.name.toLowerCase())
        ]);

        const aiPlayersList: IPlayer[] = aiNameEntries.map((entry) => ({
            name: entry.name,
            pronouns: entry.pronouns,
            controledBy: 'ai',
            personality: buildRandomPersonality()
        }));

        const humanPlayersList: IPlayer[] = trimmedHumanNames.map((name) => ({
            name,
            pronouns: pronounLookup.get(name.toLowerCase()) ?? 'they/them',
            controledBy: 'human'
        }));

        const players: IPlayer[] = [...aiPlayersList, ...humanPlayersList];
        const remainingNamePool = baseNamePool.filter((entry) => !namesUsedLower.has(entry.name.toLowerCase()));
        setLastNamePool(remainingNamePool);

        const playerCount = players.length;
        const maxPlayers = clamp(playerCount, 5, 15);
        const gameCountIndex = maxPlayers - 5;
        const officialCount = characterCounts[gameCountIndex];
        if (!officialCount) {
            console.error('Unable to derive population counts for', maxPlayers);
            return;
        }

        const sortedScript = Array.from(new Set(script)).sort();
        const scriptRoles = sortedScript
            .map((roleId) => rolesData.find((role) => role.id === roleId))
            .filter((role): role is CharacterTokens => Boolean(role));

        const candidateByTeam: Record<CharacterTypes, CharacterTokens[]> = {
            townsfolk: [],
            outsider: [],
            minion: [],
            demon: [],
            traveler: [],
            loric: [],
            fabled: []
        };

        scriptRoles.forEach((role) => {
            const team = normalizeTeam(role.team);
            candidateByTeam[team].push(role);
        });

        const population: Record<CharacterTypes, number> = {
            demon: officialCount.demon,
            minion: officialCount.minion,
            outsider: officialCount.outsider,
            townsfolk: officialCount.townsfolk,
            traveler: 0,
            loric: 0,
            fabled: 0
        };

        const scriptModifier: Record<CharacterTypes, number> = {
            demon: 0,
            minion: 0,
            outsider: 0,
            townsfolk: 0,
            traveler: 0,
            loric: 0,
            fabled: 0
        };

        const adjustPopulation = (team: CharacterTypes, delta: number): number => {
            const before = population[team] ?? 0;
            const available = candidateByTeam[team]?.length ?? 0;
            const desired = clamp(before + delta, 0, available);
            const actualDelta = desired - before;
            population[team] = desired;
            scriptModifier[team] += actualDelta;
            return actualDelta;
        };

        let drunkTaskQueued = false;

        const applyModifiers = (role: CharacterTokens) => {
            if (role.id === 'baron') {
                const addedOutsiders = adjustPopulation('outsider', 2);
                if (addedOutsiders > 0) {
                    adjustPopulation('townsfolk', -addedOutsiders);
                }
            }

            if (role.id === 'drunk') {
                adjustPopulation('townsfolk', 1);
                if (!drunkTaskQueued) {
                    drunkTaskQueued = true;
                    dispatch(
                        enqueueBack({
                            id: 'drunk_choice',
                            type: 'custom',
                            kind: 'custom',
                            interaction: 'system',
                            payload: {
                                phase: 'setup',
                                roleId: 'drunk',
                                stepType: 'resolve_effect',
                                nightNumber: 1
                            }
                        })
                    );
                }
            }
        };

        const orderedTeams: CharacterTypes[] = ['demon', 'minion', 'outsider', 'townsfolk'];
        const bag: Roles[] = [];

        orderedTeams.forEach((team) => {
            const desired = population[team] ?? 0;
            if (desired <= 0) {
                return;
            }

            const candidates = shuffleArray(candidateByTeam[team] ?? []);
            let added = 0;
            for (const candidate of candidates) {
                if (added >= desired) {
                    break;
                }
                bag.push(candidate.id as Roles);
                applyModifiers(candidate);
                added += 1;
            }

            population[team] = added;
        });

        if (bag.length !== playerCount) {
            console.error('Role bag length mismatch', { expected: playerCount, actual: bag.length });
            return;
        }

        console.debug('script modifiers applied', scriptModifier);
        const randomizedBag = shuffleArray(bag);
        const randomizedPlayers = shuffleArray(players);

        const seats: ISeat[] = randomizedBag.map((role, index) => ({
            ID: index + 1,
            player: randomizedPlayers[index],
            role,
            isAlive: true,
            hasVote: true
        }));

        dispatch(setSeats(seats));
        setHasSubmittedSetup(true);
        setIsOpen(false);
    };

    return (
        <>
            <Button
                size='sm'
                variant='outline'
                type='button'
                disabled={!hasScript}
                onClick={() => hasScript && setIsOpen(true)}
                title={hasScript ? 'Setup a new game' : 'Pick a script before configuring players'}
                className='whitespace-nowrap'
            >
                Setup Game
            </Button>
            <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <DialogContent className='sm:max-w-lg'>
                    <DialogHeader>
                        <DialogTitle>Setup Game</DialogTitle>
                        <DialogDescription>Define how many human and AI players you want.</DialogDescription>
                    </DialogHeader>
                    <form
                        className='space-y-4'
                        onSubmit={handleSubmit}
                    >
                        <div className='grid gap-2'>
                            <Label htmlFor='ai-players'>AI Players</Label>
                            <Input
                                id='ai-players'
                                type='number'
                                min={0}
                                max={15}
                                step={1}
                                value={aiPlayers}
                                onChange={handleAiPlayersChange}
                            />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='human-players'>Human Players</Label>
                            <Input
                                id='human-players'
                                type='number'
                                min={0}
                                max={15}
                                step={1}
                                value={humanPlayers}
                                onChange={handleHumanPlayersChange}
                            />
                        </div>
                        {Array.from({ length: humanPlayers }, (_, index) => (
                            <div
                                className='grid gap-2'
                                key={`human-name-${index}`}
                            >
                                <Label htmlFor={`human-name-${index}`}>{labelForNameField(index)}</Label>
                                <Input
                                    id={`human-name-${index}`}
                                    type='text'
                                    required
                                    value={humanNames[index] ?? ''}
                                    onChange={(event) => handleHumanNameChange(index, event.target.value)}
                                />
                            </div>
                        ))}
                        <Button
                            type='submit'
                            disabled={!isFormValid}
                            className='w-full'
                        >
                            Save players
                        </Button>
                        {!isPlayerCountValid && (
                            <p className='text-xs text-destructive'>Total players must be between 5 and 15.</p>
                        )}
                        {hasSubmittedSetup && lastNamePool.length > 0 && (
                            <p className='text-xs text-muted-foreground'>
                                Possible names remaining: {lastNamePool.length}
                            </p>
                        )}
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
