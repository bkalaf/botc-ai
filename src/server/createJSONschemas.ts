// src/server/createJSONschemas.ts
import jsonSchemaToZod from 'json-schema-to-zod';
import { washerwomanTokens } from '../prompts/washerwomanTokens';
import { PromptSpec } from '../prompts/prompt-types';
import { investigatorTokens } from '../prompts/investigatorTokens';
import { librarianTokens } from '../prompts/librarianTokens';
import { playerButlerChooseMaster } from '../prompts/playerButlerChooseMaster';
import { empathNumber } from '../prompts/empathNumber';
import { fortuneTellerInfo } from '../prompts/fortuneTellerInfo';
import { chefNumber } from '../prompts/chefNumber';
import { drunkChoice } from '../prompts/drunkChoice';
import { poisonerNightAction } from '../prompts/poisonerNightAction';
import { travelerAlignment } from '../prompts/travelerAlignment';
import { demonBluffs } from '../prompts/demonBluffs';
import { monkProtect } from '../prompts/monkProtect';

function processThis(spec: PromptSpec) {
    const wwSchema = spec.schema;
    const schema = typeof wwSchema === 'function' ? wwSchema({ playerCount: 15 }) : wwSchema;
    if (!schema) return;
    const zodObject = jsonSchemaToZod(schema);

    console.log(schema.title);
    console.log(zodObject);
}

processThis(washerwomanTokens);
processThis(librarianTokens);
processThis(investigatorTokens);
processThis(playerButlerChooseMaster);
processThis(empathNumber);
processThis(fortuneTellerInfo);
processThis(chefNumber);
processThis(drunkChoice);
processThis(poisonerNightAction);
processThis(travelerAlignment);
processThis(demonBluffs);
processThis(monkProtect);