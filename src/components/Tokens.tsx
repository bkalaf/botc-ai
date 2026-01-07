// src/components/Tokens.tsx
import butlerGoodImg from './../assets/images/butler_g.png';
import butlerEvilImg from './../assets/images/butler_e.png';
import chefGoodImg from './../assets/images/chef_g.png';
import chefEvilImg from './../assets/images/chef_e.png';
import drunkGoodImg from './../assets/images/drunk_g.png';
import drunkEvilImg from './../assets/images/drunk_e.png';
import empathGoodImg from './../assets/images/empath_g.png';
import empathEvilImg from './../assets/images/empath_e.png';
import fortunetellerGoodImg from './../assets/images/fortuneteller_g.png';
import fortunetellerEvilImg from './../assets/images/fortuneteller_e.png';
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
import poisonerGoodImg from './../assets/images/poisoner_g.png';
import poisonerEvilImg from './../assets/images/poisoner_e.png';
import ravenkeeperGoodImg from './../assets/images/ravenkeeper_g.png';
import ravenkeeperEvilImg from './../assets/images/ravenkeeper_e.png';
import recluseGoodImg from './../assets/images/recluse_g.png';
import recluseEvilImg from './../assets/images/recluse_e.png';
import saintGoodImg from './../assets/images/saint_g.png';
import saintEvilImg from './../assets/images/saint_e.png';
import scarletwomanGoodImg from './../assets/images/scarletwoman_g.png';
import scarletwomanEvilImg from './../assets/images/scarletwoman_e.png';
import slayerGoodImg from './../assets/images/slayer_g.png';
import slayerEvilImg from './../assets/images/slayer_e.png';
import soldierGoodImg from './../assets/images/soldier_g.png';
import soldierEvilImg from './../assets/images/soldier_e.png';
import spyGoodImg from './../assets/images/spy_g.png';
import spyEvilImg from './../assets/images/spy_e.png';
import undertakerGoodImg from './../assets/images/undertaker_g.png';
import undertakerEvilImg from './../assets/images/undertaker_e.png';
import virginGoodImg from './../assets/images/virgin_g.png';
import virginEvilImg from './../assets/images/virgin_e.png';
import washerwomanGoodImg from './../assets/images/washerwoman_g.png';
import washerwomanEvilImg from './../assets/images/washerwoman_e.png';
import { TokenBase } from './CharacterTokenBase';
import { Roles } from '../data/types';
import React from 'react';

export const BaseToken = (s: string, alt: string): (() => React.JSX.Element) => {
    const component: () => React.JSX.Element = () => (
        <TokenBase
            className='absolute inset-0 h-full w-full rounded-full object-cover scale-110 z-10'
            pngSrc={s}
            alt={alt}
        />
    );
    return component;
};

const ChefGood = BaseToken(chefGoodImg, 'Chef Good');
const ChefEvil = BaseToken(chefEvilImg, 'Chef Evil');
const VirginGood = BaseToken(virginGoodImg, 'Virgin Good');
const VirginEvil = BaseToken(virginEvilImg, 'Virgin Evil');
const SoldierGood = BaseToken(soldierGoodImg, 'Soldier Good');
const SoldierEvil = BaseToken(soldierEvilImg, 'Soldier Evil');

console.log(chefGoodImg);
console.log(chefEvilImg);
console.log(virginGoodImg);
console.log(virginEvilImg);
console.log(soldierGoodImg);
console.log(soldierEvilImg);

export const GoodTokens: Partial<Record<Roles, () => React.JSX.Element>> = {
    chef: ChefGood,
    soldier: SoldierGood,
    virgin: VirginGood
};
export const EvilTokens: Partial<Record<Roles, () => React.JSX.Element>> = {
    chef: ChefEvil,
    soldier: SoldierEvil,
    virgin: VirginEvil
};
