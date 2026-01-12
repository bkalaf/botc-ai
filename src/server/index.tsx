// src/server/index.tsx
import { chefHandler } from './chefNumber';
import { empathHandler } from './empathInfo';
import { fortuneTellerChoiceHandler } from './fortunetellerChoice';
import { investigatorHandler } from './investigatorInfo';
import { librarianHandler } from './librarianInfo';
import { demonInfo, minionInfo } from './minionInfo';
import { notYetImplemented } from './notYetImplemented';
import { washerwomanHandler } from './washerwomanInfo';

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
    butler: notYetImplemented
};
