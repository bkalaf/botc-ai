// src/server/processClaims.tsx
import { CharacterTypes, Roles } from '../data/types';
import { AllClaims, Claim } from '../store/types/memory-types';
import { $$ROLES } from '@/data/types';
import { Personality } from '../store/types/player-types';

export type ISeatInfoDetails = {
    role?: Roles;
    characterType?: CharacterTypes;
    alignment?: 'good' | 'evil';
    confidence: number;
    reason?: string;
};
export type ISeatInfo = {
    ID: number;
    name: string;
    isSelf: boolean;
    isHuman: boolean;
    isAI: boolean;
    role: Roles[];
    characterType: CharacterTypes[];
    alignment: ('good' | 'evil')[];
    personality?: Personality;
    details: ISeatInfoDetails[];
};
export function processClaims(claims: (AllClaims | { infoType: undefined; ID: number })[]) {
    function updateGrim(ID: number, { details, ...info }: Partial<ISeatInfo>, detail?: ISeatInfoDetails) {
        const { details: details2, ...current } = grimoire[ID] ?? { ID, details: [] };
        const $details = detail ? [...details2, ...(details ?? []), detail] : [...details2, ...(details ?? [])];
        const seatInfo = {
            ...current,
            ...info,
            details: Array.from(new Set($details).values())
        };
        grimoire[ID] = seatInfo;
    }
    const grimoire = {} as Record<number, ISeatInfo>;
    const demonBluffs = [] as Roles[];
    const globalClaims = [];
    for (const claim of claims) {
        const { ID } = claim;
        if (claim.infoType == null) {
            updateGrim(ID, {
                isSelf: true
            });
            continue;
        }
        switch (claim.infoType) {
            case 'player_info': {
                const { playerInfo } = claim;
                const { personality } =
                    playerInfo?.controledBy === 'human' ?
                        { ...playerInfo, personality: undefined }
                    :   { ...(playerInfo ?? {}) };
                const { isSelf } = grimoire[ID] ?? { isSelf: false };
                updateGrim(ID, {
                    ID,
                    name: playerInfo?.name!,
                    isSelf,
                    isHuman: playerInfo?.controledBy === 'human',
                    isAI: playerInfo?.controledBy === 'ai',
                    personality: isSelf ? personality : undefined
                });
                break;
            }
            case 'assign_token': {
                const { role, team } = claim;
                updateGrim(ID, {
                    role: [role],
                    characterType: [team],
                    alignment: team === 'minion' || team === 'demon' ? ['evil'] : ['good'],
                    isSelf: true
                });
                break;
            }
            case 'demon_bluffs': {
                const {
                    data: { demonBluffs }
                } = claim;
                demonBluffs.push(...(demonBluffs ?? []));
                break;
            }
            case 'evil_team': {
                const { demons, minions } = claim.data;
                if (demons) {
                    for (const ID of demons) {
                        updateGrim(ID, {
                            characterType: ['demon'],
                            alignment: ['evil']
                        });
                    }
                }
                if (minions) {
                    for (const ID of minions) {
                        updateGrim(ID, {
                            characterType: ['minion'],
                            alignment: ['evil']
                        });
                    }
                }
                break;
            }
            case 'night_info': {
                const { role, data } = claim;
                switch (role) {
                    case 'washerwoman': {
                        const {
                            shown: { seats, role: $role }
                        } = data;
                        updateGrim(
                            seats[0],
                            {},
                            {
                                reason: 'washerwoman_info',
                                role: $role,
                                characterType: 'townsfolk',
                                confidence: 0.5
                            }
                        );
                        updateGrim(
                            seats[1],
                            {},
                            {
                                reason: 'washerwoman_info',
                                role: $role,
                                characterType: 'townsfolk',
                                confidence: 0.5
                            }
                        );
                        break;
                    }
                    case 'investigator': {
                        const {
                            shown: { seats, role: $role }
                        } = data;
                        updateGrim(
                            seats[0],
                            {},
                            {
                                reason: 'investigator_info',
                                role: $role,
                                characterType: 'minion',
                                confidence: 0.5
                            }
                        );
                        updateGrim(
                            seats[1],
                            {},
                            {
                                reason: 'investigator_info',
                                role: $role,
                                characterType: 'minion',
                                confidence: 0.5
                            }
                        );
                        break;
                    }

                    case 'librarian': {
                        const { shown } = data;
                        if (shown === 0) {
                            globalClaims.push({ outsiderCount: 0, reason: 'librarian_claim', confidence: 0.5 });
                            break;
                        }
                        const { seats, role: $role } = shown;
                        updateGrim(
                            seats[0],
                            {},
                            {
                                reason: 'librarian_info',
                                role: $role,
                                characterType: 'outsider',
                                confidence: 0.5
                            }
                        );
                        updateGrim(
                            seats[1],
                            {},
                            {
                                reason: 'librarian_info',
                                role: $role,
                                characterType: 'outsider',
                                confidence: 0.5
                            }
                        );
                        break;
                    }
                    case 'chef': {
                        const { shown } = data;
                        globalClaims.push({ reason: 'chef_claim', evilPairs: shown });
                        break;
                    }
                    case 'empath': {
                        const { shown, neighbors } = data;
                        const confidence = shown === 2 || shown === 0 ? 0.9 : 0.5;
                        const alignment =
                            shown === 2 ? 'evil'
                            : shown === 0 ? 'good'
                            : 'evil';
                        updateGrim(neighbors[0], {}, { reason: 'empath_info', confidence, alignment });
                        updateGrim(neighbors[1], {}, { reason: 'empath_info', confidence, alignment });
                        break;
                    }
                    case 'monk':
                    case 'undertaker':
                    case 'ravenkeeper':
                    case 'mayor':
                    case 'soldier':
                    case 'virgin':
                    case 'slayer':
                    case 'fortuneteller':
                    case 'saint':
                    case 'recluse':
                    case 'butler':
                    case 'drunk':
                    case 'scarletwoman':
                    case 'spy':
                    case 'baron':
                    case 'poisoner':
                    case 'imp':
                    case 'bootlegger':
                    case 'gunslinger':
                    case 'beggar':
                    case 'scapegoat':
                    case 'thief':
                    case 'bureaucrat':
                    case 'spiritofivory':
                    case 'sentinel':
                    case 'fibbin':
                    case 'gardener':
                }
            }
            case 'role_claim':
            case 'character_type_claim':
        }
    }
}
