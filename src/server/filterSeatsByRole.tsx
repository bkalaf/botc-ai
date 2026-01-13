// src/server/filterSeatsByRole.tsx
import { Roles } from '../data/types';
import { ISeatedPlayer } from '../store/types/player-types';

export function filterSeatsByRole(seats: ISeatedPlayer[], role: Roles) {
    return seats.filter((x) => (x.thinks ?? x.role) === role)[0];
}
