// src/utils/nightOrder.ts
import { $$ROLES, Roles } from '../data/types';

type NightOrderKey = 'firstNight' | 'otherNight';

export const buildNightOrderIndex = (roles: Roles[], orderKey: NightOrderKey) => {
    const uniqueRoles = Array.from(new Set(roles));
    const orderedRoles = uniqueRoles
        .map((role) => ({
            role,
            order: $$ROLES[role]?.[orderKey] ?? 0
        }))
        .filter(({ order }) => order > 0)
        .sort((a, b) => a.order - b.order);

    return Object.fromEntries(orderedRoles.map(({ role }, index) => [role, index + 1])) as Partial<
        Record<Roles, number>
    >;
};
