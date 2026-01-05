import { CharacterTypes, Roles } from '../../data/types';

export type PlayerController = 'ai' | 'human';

export interface IPlayer {
    name: string;
    email?: string;
    pronouns?: string;
    controledBy: PlayerController;
    personality?: Personality;
}

export interface ISeat {
    ID: number;
    player: IPlayer;
    role: Roles;
    thinks?: Roles;
    isAlive: boolean;
    hasVote: boolean;
}

export interface ISeatedPlayer {
    name: string;
    ID: number;
    personality: Personality;
    pronouns?: string;
    role: Roles;
    thinks?: Roles;
    hasVote: boolean;
    isAlive: boolean;
    alignment: 'good' | 'evil';
    team: CharacterTypes;
    reminders: string;
    isDrunk: boolean;
    isPoisoned: boolean;
    worldBuildingWorksheet?: WorldBuildingWorksheet;
}

export type PlayerId = ISeatedPlayer['ID'];

export interface WorldBuildingWorksheet {
    demon: DemonWorldModel;
    minions: MinionWorldModel;
    outsiders: OutsiderWorldModel;
    setupModifiers: SetupModifierWorldModel;
    intoxication: IntoxicationWorldModel;
    notes?: string;
}

export interface DemonWorldModel {
    role?: Roles;
    specialAbilities?: string[];
    killsPerNight?: number;
    constraints?: string[];
    notes?: string;
}

export interface MinionWorldModel {
    expectedCount?: number;
    confirmed?: Roles[];
    possibleSets?: Roles[][];
    notes?: string;
}

export interface OutsiderWorldModel {
    baseCount?: number;
    currentCount?: number;
    suspectedModifiers?: string[];
    notes?: string;
}

export interface SetupModifierWorldModel {
    suspectedModifiers?: string[];
    confirmedModifiers?: string[];
    notes?: string;
}

export interface IntoxicationWorldModel {
    knownDrunk?: PlayerId[];
    knownPoisoned?: PlayerId[];
    suspectedDrunk?: PlayerId[];
    suspectedPoisoned?: PlayerId[];
    notes?: string;
}

export type TrustModels = 'all_trusting' | 'skeptical' | 'doubting_thomas';
export type TableImpactStyles = 'disruptive' | 'stabilizing' | 'procedural';
export type ReasoningModes = 'deductive' | 'associative' | 'surface';
export type InformationHandlingStyle = 'archivist' | 'impressionistic' | 'signal_driven';
export type VoiceStyles = 'quiet' | 'conversational' | 'dominant';

export type Personality = {
    trustModel: TrustModels;
    tableImpact: TableImpactStyles;
    reasoningMode: ReasoningModes;
    informationHandling: InformationHandlingStyle;
    voiceStyle: VoiceStyles;
};

/** Maps each trait -> option -> behavioral instruction text. */
export type PersonalityModulation = Partial<{
    [K in keyof Personality]: Partial<Record<Personality[K], string>>;
}>;
