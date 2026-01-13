// src/server/index.tsx
import { InputSchema } from '../prompts/prompt-types';
import { AppDispatch, RootState } from '../store';
import { chefHandler } from './chefNumber';
import { empathHandler } from './empathInfo';
import { fortuneTellerChoiceHandler } from './fortunetellerChoice';
import { investigatorHandler } from './investigatorInfo';
import { librarianHandler } from './librarianInfo';
import { demonInfo, minionInfo } from './minionInfo';
import { setupComplete } from './nightOne';
import { notYetImplemented } from './notYetImplemented';
import { washerwomanHandler } from './washerwomanInfo';
import z from 'zod';

type ServerFns = Record<
    string,
    (state: RootState, dispatch: AppDispatch) => ({ data }: { data: any }) => Promise<void>
>;
// src/server/index.ts
export const $$serverFirstFns = {
    minionInfo: minionInfo,
    demonInfo: demonInfo,
    chef: chefHandler,
    washerwoman: washerwomanHandler,
    librarian: librarianHandler,
    investigator: investigatorHandler,
    empath: empathHandler,
    fortuneteller: fortuneTellerChoiceHandler,
    monk: notYetImplemented,
    ravenkeeper: notYetImplemented,
    slayer: notYetImplemented,
    poisoner: notYetImplemented,
    spy: notYetImplemented,
    scarletWoman: notYetImplemented,
    undertaker: notYetImplemented,
    butler: notYetImplemented,
    setupComplete: setupComplete
};
