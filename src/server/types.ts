// src/server/types.ts
import z from 'zod';
import { joinWithCommasAndAnd } from './joinWithCommaAndAnd';
import { demonRoles, minionRoles, outsiderRoles, playerRoles, townsfolkRoles } from '../prompts/prompt-types';

const seats = (playerCount: number) =>
    z.int().min(1, 'Must be greater than or equal to 1').max(playerCount, 'Must be less than or equal to playerCount');
const asEnum = (enums: string[]) => z.enum(enums, 'Must be one of the following: ' + joinWithCommasAndAnd(enums));
const allRoles = asEnum(playerRoles);
const allTownsfolk = asEnum(townsfolkRoles);
const allOutsiders = asEnum(outsiderRoles);
const allMinions = asEnum(minionRoles);
const allDemons = asEnum(demonRoles);

const $z = (playerCount: number) => ({
    seats,
    allRoles,
    allTownsfolk,
    allOutsiders,
    allMinions,
    allDemons,
    twoSeats: z.array(seats(playerCount)).min(2, 'Must be exactly two seats.').max(2, 'Must be exactly two seats.')
});

export default $z;
