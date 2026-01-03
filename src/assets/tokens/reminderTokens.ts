//src/assets/tokens/reminderTokens.ts
export type ReminderTokenInfo = {
    text: string;
    traits?: string[];
    voteModifier?: number;
    globals?: string[];
};

export const reminderTokens = {
    imp: {
        dead: {
            text: 'Dead',
            isChanneled: true
        }
    },
    drunk: {
        is_the_drunk: {
            text: 'Is The Drunk',
            traits: ['drunk']
        }
    },
    bureaucrat: {
        three_votes: {
            text: '3 Votes',
            voteModifier: 3,
            isChanneled: true
        }
    },
    fibbin: {
        no_ability: {
            text: 'No Ability',
            traits: ['no_ability']
        }
    },
    spiritofivory: {
        no_more_evil: {
            text: 'No More Evil',
            globals: ['evil_conversion']
        }
    },
    washerwoman: {
        townsfolk: {
            text: 'Townsfolk'
        },
        wrong: {
            text: 'Wrong'
        }
    },
    librarian: {
        outsider: {
            text: 'Outsider'
        },
        wrong: {
            text: 'Wrong'
        }
    },
    investigator: {
        minion: {
            text: 'Minion'
        },
        wrong: {
            text: 'Wrong'
        }
    },
    fortuneteller: {
        red_herring: {
            text: 'Red Herring'
        }
    },
    monk: {
        safe: {
            text: 'Safe',
            isChanneled: true
        }
    },
    virgin: {
        no_ability: {
            text: 'No Ability',
            traits: ['no_ability']
        }
    },
    slayer: {
        no_ability: {
            text: 'No Ability',
            traits: ['no_ability']
        }
    },
    undertaker: {
        executed: {
            text: 'Executed'
        }
    },
    ravenkeeper: {
        died_tonight: {
            text: 'Died Tonight'
        }
    },
    poisoner: {
        poisoned: {
            text: 'Poisoned',
            traits: ['poisoned'],
            isChanneled: true
        }
    },
    scarletwoman: {
        is_the_demon: {
            text: 'Is The Demon'
        }
    },
    thief: {
        negative_vote: {
            text: 'Negative Vote',
            voteModifier: -1,
            isChanneled: true
        }
    }
} as const;

export type ConcatenateKeys<T> = {
    [K1 in keyof T]: {
        [K2 in keyof T[K1]]: `${K1 & string}_${K2 & string}`;
    }[keyof T[K1]];
}[keyof T];

export type ReminderTokenKeys = ConcatenateKeys<typeof reminderTokens>;
