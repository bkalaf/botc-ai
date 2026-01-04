//src/assets/tokens/index.ts
import { Roles } from './../../setup';
import { env } from '../../env';
import firstNight from './firstNight';
import otherNight from './otherNight';
import { reminderTokens } from './reminderTokens';
import { setupModifiers } from './setupModifiers';
import { tokens } from './tb';

console.log(`Roles: `, Roles);

export const $reminderTokens = Object.fromEntries(
    Object.entries(reminderTokens).map(([role, tokens]) => {
        return [
            role,
            Object.entries(tokens).map(([key, data]) => ({
                ...data,
                role: role as Roles,
                key: [role, key].join('_')
            }))
        ] as [Roles, IReminders[]];
    })
);
export const allReminderTokens = Object.fromEntries(
    Object.values($reminderTokens)
        .reduce((pv, cv) => [...pv, ...cv], [])
        .map((x) => [x.key, x])
);
console.log(`allReminderTokens`, allReminderTokens);
function getAlignment(characterType: CharacterTypes): Alignments {
    switch (characterType) {
        case 'townsfolk':
        case 'outsider':
            return 'good';
        case 'minion':
        case 'demon':
            return 'evil';
        case 'traveler':
            return 'either';
        case 'fabled':
        case 'loric':
            return 'neutral';
        default:
            return 'neutral';
    }
}
function getImages(role: Roles, characterType: CharacterTypes): IIconPaths {
    const neutral =
        ['loric', 'fabled', 'traveler'].includes(characterType) ?
            `${env.VITE_ICONS_BASE_PATH}/${role}.webp`
        :   undefined;
    const evil = ['loric', 'fabled'].includes(characterType) ? undefined : `${env.VITE_ICONS_BASE_PATH}/${role}_e.webp`;
    const good = ['loric', 'fabled'].includes(characterType) ? undefined : `${env.VITE_ICONS_BASE_PATH}/${role}_g.webp`;
    return {
        neutral,
        good,
        evil
    };
}
const $firstNight = Object.fromEntries(firstNight.map((v, ix) => [v, ix]));
const $otherNight = Object.fromEntries(otherNight.map((v, ix) => [v, ix]));

function getNight(lookup: Partial<Record<Roles, number>>) {
    return (role: Roles) => lookup[role];
}
const $first = getNight($firstNight);
const $other = getNight($otherNight);

const allTokens = Object.fromEntries(
    Object.entries(tokens)
        .map(([edition, editionTokens]) =>
            Object.entries(editionTokens).map(([characterType, characterTypeTokens]) =>
                Object.entries(characterTypeTokens).map(([role, roleTokens]) => {
                    const nightOrder = [$first(role as Roles), $other(role as Roles)] as [number?, number?];
                    return [
                        role as Roles,
                        {
                            ...roleTokens,
                            edition,
                            characterType,
                            key: role as Roles,
                            name: Roles[role as Roles],
                            alignment: getAlignment(characterType as CharacterTypes),
                            icons: getImages(role as Roles, characterType as CharacterTypes),
                            reminders: $reminderTokens[role as Roles],
                            setupModifiers: setupModifiers[role as Roles],
                            nightOrder: nightOrder[0] == null && nightOrder[1] == null ? undefined : nightOrder
                        } as IRole
                    ] as [Roles, IRole];
                })
            )
        )
        .reduce((pv, cv) => [...pv, ...cv], [])
        .reduce((pv, cv) => [...pv, ...cv], [])
);
export const createCharacterToken = (role: Roles, perceivedAs?: Roles): any => {
    const result: ICharacterToken = {
        get is() {
            return allTokens[role];
        },
        get perceivedAs() {
            return allTokens[perceivedAs ?? role];
        }
    };
    return {
        _is: role,
        _perceivedAs: perceivedAs ?? role
    };
};
export default allTokens;
