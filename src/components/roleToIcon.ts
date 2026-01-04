// src/components/roleToIcon.ts
import baronGoodImg from './../assets/images/baron_g.png';
import baronEvilImg from './../assets/images/baron_e.png';
// import beggarGoodImg from './../assets/images/beggar_g.png';
// import beggarEvilImg from './../assets/images/beggar_e.png';
// import beggarImg from './../assets/images/beggar.png';
// import bootleggerGoodImg from './../assets/images/bootlegger.png';
// import bureaucratImg from './../assets/images/bureaucrat.png';
// import bureaucratEvilImg from './../assets/images/bureaucrat_e.png';
// import bureaucratGoodImg from './../assets/images/bureaucrat_g.png';
import butlerGoodImg from './../assets/images/butler_g.png';
import butlerEvilImg from './../assets/images/butler_e.png';
import chefGoodImg from './../assets/images/chef_g.png';
import chefEvilImg from './../assets/images/chef_e.png';
// import dawnGoodImg from './../assets/images/dawn-breaks';
import drunkGoodImg from './../assets/images/drunk_g.png';
import drunkEvilImg from './../assets/images/drunk_e.png';
import empathGoodImg from './../assets/images/empath_g.png';
import empathEvilImg from './../assets/images/empath_e.png';
// import fibbinImg from './../assets/images/fibbin.png';
import fortunetellerGoodImg from './../assets/images/fortuneteller_g.png';
import fortunetellerEvilImg from './../assets/images/fortuneteller_e.png';
// import gardenerImg from './../assets/images/gardener.png';
// import gunslingerGoodImg from './../assets/images/gunslinger_g.png';
// import gunslingerEvilImg from './../assets/images/gunslinger_e.png';
// import gunslingerImg from './../assets/images/gunslinger.png';
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
// import nightGoodImg from './../assets/images/night-falls';
import poisonerGoodImg from './../assets/images/poisoner_g.png';
import poisonerEvilImg from './../assets/images/poisoner_e.png';
import ravenkeeperGoodImg from './../assets/images/ravenkeeper_g.png';
import ravenkeeperEvilImg from './../assets/images/ravenkeeper_e.png';
import recluseGoodImg from './../assets/images/recluse_g.png';
import recluseEvilImg from './../assets/images/recluse_e.png';
import saintGoodImg from './../assets/images/saint_g.png';
import saintEvilImg from './../assets/images/saint_e.png';
// import scapegoatGoodImg from './../assets/images/scapegoat_g.png';
// import scapegoatEvilImg from './../assets/images/scapegoat_e.png';
// import scapegoatImg from './../assets/images/scapegoat.png';
import scarletwomanGoodImg from './../assets/images/scarletwoman_g.png';
import scarletwomanEvilImg from './../assets/images/scarletwoman_e.png';
// import sentinelImg from './../assets/images/sentinel.png';
import slayerGoodImg from './../assets/images/slayer_g.png';
import slayerEvilImg from './../assets/images/slayer_e.png';
import soldierGoodImg from './../assets/images/soldier_g.png';
import soldierEvilImg from './../assets/images/soldier_e.png';
// import spiritofivoryImg from './../assets/images/spiritofivory.png';
import spyGoodImg from './../assets/images/spy_g.png';
import spyEvilImg from './../assets/images/spy_e.png';
// import thiefImg from './../assets/images/thief.png';
// import thiefEvilImg from './../assets/images/thief_e.png';
// import thiefGoodImg from './../assets/images/thief_g.png';
import undertakerGoodImg from './../assets/images/undertaker_g.png';
import undertakerEvilImg from './../assets/images/undertaker_e.png';
import virginGoodImg from './../assets/images/virgin_g.png';
import virginEvilImg from './../assets/images/virgin_e.png';
import washerwomanGoodImg from './../assets/images/washerwoman_g.png';
import washerwomanEvilImg from './../assets/images/washerwoman_e.png';
import { Roles } from '../data/types';

export const roleToIcon: Record<Roles, [any, any?]> = {
    empath: [empathGoodImg, empathEvilImg],
    undertaker: [undertakerGoodImg, undertakerEvilImg],
    chef: [chefGoodImg, chefEvilImg],
    librarian: [librarianGoodImg, librarianEvilImg],
    investigator: [investigatorGoodImg, investigatorEvilImg],
    washerwoman: [washerwomanGoodImg, washerwomanEvilImg],
    slayer: [slayerGoodImg, slayerEvilImg],
    soldier: [soldierGoodImg, soldierEvilImg],
    virgin: [virginGoodImg, virginEvilImg],
    spy: [spyGoodImg, spyEvilImg],
    scarletwoman: [scarletwomanGoodImg, scarletwomanEvilImg],
    baron: [baronGoodImg, baronEvilImg],
    poisoner: [poisonerGoodImg, poisonerEvilImg],
    imp: [impGoodImg, impEvilImg],
    recluse: [recluseGoodImg, recluseEvilImg],
    saint: [saintGoodImg, saintEvilImg],
    ravenkeeper: [ravenkeeperGoodImg, ravenkeeperEvilImg],
    monk: [monkGoodImg, monkEvilImg],
    mayor: [mayorGoodImg, mayorEvilImg],
    fortuneteller: [fortunetellerGoodImg, fortunetellerEvilImg],
    drunk: [drunkGoodImg, drunkEvilImg],
    butler: [butlerGoodImg, butlerEvilImg]
};
