import { th } from 'zod/v4/locales';

//src/assets/tokens/tb.ts
export type IDefinedRole = Omit<
    IRole,
    'alignment' | 'characterType' | 'edition' | 'key' | 'name' | 'nightOrder' | 'reminders' | 'icons'
>;

export const tokens: Record<Editions, Partial<Record<CharacterTypes, Partial<Record<Roles, IDefinedRole>>>>> = {
    tb: {
        traveler: {
            beggar: {
                bluffType: 'risky',
                threatType: 'low',
                abilityText:
                    'You must use a vote token to vote. If a dead player gives you theirs, you learn their alignment. You are sober & healthy.'
            },
            bureaucrat: {
                abilityText: 'Each night, choose a player (not yourself): their vote counts as 3 votes tomorrow.',
                bluffType: 'never',
                threatType: 'low',
                firstNight: 'The Bureaucrat chooses a player.',
                otherNight: 'The Bureaucrat chooses a player.'
            },
            thief: {
                abilityText: 'Each night, choose a player (not yourself): their vote counts as negative 1 tomorrow.',
                bluffType: 'never',
                threatType: 'medium',
                firstNight: 'The Thief chooses a player.',
                otherNight: 'The Thief chooses a player.'
            },
            gunslinger: {
                abilityText:
                    'Each day, after the 1st vote has been tallied, you may choose a player that voted: they die.',
                bluffType: 'never',
                threatType: 'high'
            },
            scapegoat: {
                abilityText: 'If a player of your alignment is executed, you might be executed instead.',
                bluffType: 'never',
                threatType: 'low'
            }
        },
        fabled: {
            spiritofivory: {
                abilityText: "There can't be more than 1 extra evil player.",
                bluffType: 'never',
                threatType: 'never'
            },
            fibbin: {
                abilityText: 'Once per game, 1 good player might get incorrect information.',
                bluffType: 'never',
                threatType: 'never'
            },
            sentinel: {
                abilityText: 'There might be 1 extra or 1 fewer Outsider in play.',
                bluffType: 'never',
                threatType: 'never'
            }
        },
        loric: {
            gardener: {
                abilityText: 'The Storyteller assigns 1 or more players characters.',
                bluffType: 'never',
                threatType: 'never',
                traits: ['allows_role_assignments']
            },
            bootlegger: {
                abilityText: 'This script has custom homebrew rules allowed.',
                bluffType: 'never',
                threatType: 'never'
            }
        },
        townsfolk: {
            washerwoman: {
                abilityText: 'You start knowing that 1 of 2 players is a particular Townsfolk.',
                firstNight: 'Show the Townsfolk character token. Point to both the TOWNSFOLK and WRONG players.',
                bluffType: 'start_knowing',
                threatType: 'low'
            },
            librarian: {
                abilityText: 'You start knowing that 1 of 2 players is a particular Outsider.',
                firstNight: 'Show the Townsfolk character token. Point to both the OUTSIDER and WRONG players.',
                bluffType: 'start_knowing',
                threatType: 'low'
            },
            investigator: {
                abilityText: 'You start knowing that 1 of 2 players is a particular Minion.',
                firstNight: 'Show the Townsfolk character token. Point to both the MINION and WRONG players.',
                bluffType: 'start_knowing',
                threatType: 'low'
            },
            chef: {
                abilityText: 'You start knowing how many pairs of evil players there are.',
                firstNight: 'Give a finger signal.',
                threatType: 'low',
                bluffType: 'start_knowing'
            },
            fortuneteller: {
                abilityText:
                    'Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.',
                firstNight: 'The Fortune Teller chooses 2 players. Nod if either is the Demon (or the RED HERRING).',
                otherNight: 'The Fortune Teller chooses 2 players. Nod if either is the Demon (or the RED HERRING).',
                threatType: 'high',
                bluffType: 'ongoing'
            },
            empath: {
                abilityText: 'Each night, you learn how many of your 2 alive neighbors are evil.',
                firstNight: 'Give a finger signal.',
                otherNight: 'Give a finger signal.',
                bluffType: 'ongoing',
                threatType: 'high'
            },
            monk: {
                abilityText: 'Each night*, choose a player (not yourself): they are safe from the Demon tonight.',
                bluffType: 'active',
                threatType: 'high',
                otherNight: 'The Monk chooses a player.'
            },
            ravenkeeper: {
                abilityText: 'If you die at night, you are woken to choose a player: you learn their character.',
                otherNight:
                    "If the Ravenkeeper died tonight, the Ravenkeeper chooses a player. Show that player's character token.",
                bluffType: 'active',
                threatType: 'medium'
            },
            slayer: {
                abilityText:
                    'Once per game, during the day, publicly choose a player: if they are the Demon, they die.',
                bluffType: 'easy',
                threatType: 'high'
            },
            soldier: {
                abilityText: 'You are safe from the Demon.',
                bluffType: 'easy',
                threatType: 'low',
                traits: ['immune_demon']
            },
            mayor: {
                abilityText:
                    'If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.',
                bluffType: 'easy',
                threatType: 'medium'
            },
            undertaker: {
                abilityText: 'Each night*, you learn which character died by execution today.',
                otherNight: 'If a player was executed today, show their character token.',
                bluffType: 'active',
                threatType: 'medium'
            },
            virgin: {
                abilityText:
                    'The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.',
                bluffType: 'risky',
                threatType: 'medium'
            }
        },
        outsider: {
            saint: {
                bluffType: 'easy',
                threatType: 'low',
                abilityText: 'If you die by execution, your team loses.'
            },
            recluse: {
                bluffType: 'easy',
                threatType: 'low',
                abilityText: 'You might register as evil & as a Minion or Demon, even if dead.',
                traits: ['ability_persist_thru_death']
            },
            butler: {
                bluffType: 'easy',
                threatType: 'low',
                abilityText:
                    'Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.',
                firstNight: 'The Butler chooses a player.',
                otherNight: 'The Butler chooses a player.'
            },
            drunk: {
                bluffType: 'risky',
                threatType: 'low',
                abilityText:
                    'You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.'
            }
        },
        minion: {
            scarletwoman: {
                bluffType: 'active',
                threatType: 'high',
                abilityText:
                    "If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don't count.)",
                otherNight:
                    'If the Scarlet Woman became the Demon today, show them the YOU ARE token, then the Demon token.'
            },
            poisoner: {
                bluffType: 'risky',
                threatType: 'high',
                abilityText: 'Each night, choose a player: they are poisoned tonight and tomorrow day.',
                firstNight: 'The Poisoner chooses a player.',
                otherNight: 'The Poisoner chooses a player.'
            },
            baron: {
                bluffType: 'easy',
                threatType: 'low',
                abilityText: 'There are extra Outsiders in play. [+2 Outsiders]'
            },
            spy: {
                bluffType: 'risky',
                threatType: 'high',
                abilityText:
                    'Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.',
                firstNight: 'Show the Grimoire for as long as the Spy needs.',
                otherNight: 'Show the Grimoire for as long as the Spy needs.',
                traits: ['ability_persist_thru_death']
            }
        },
        demon: {
            imp: {
                bluffType: 'risky',
                threatType: 'high',
                abilityText:
                    'Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.',
                otherNight:
                    'The Imp chooses a player.  If the Imp chose themselves: Replace 1 alive Minion token with a spare Imp token. Put the old Imp to sleep. Wake the new Imp. Show the YOU ARE token, then show the Imp token.'
            }
        }
    }
};
