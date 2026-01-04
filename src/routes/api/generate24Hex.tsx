// src/routes/api/generate24Hex.tsx
import { generateHex24 } from '../../utils/generateHex24';
import { createServerFn } from '@tanstack/react-start';

export const generate24hex = createServerFn({
    method: 'GET'
}).handler(async () => {
    const hext = generateHex24();
    return {
        id: hext
    };
});
