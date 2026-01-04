// src/global.d.ts
/// <reference types="vite/client" />

declare module '*.png' {
    const src: string;
    export default src;
}
declare module '*.jpg' {
    const src: string;
    export default src;
}
declare module '*.jpeg' {
    const src: string;
    export default src;
}
declare module '*.svg' {
    const src: string;
    export default src;
}
declare module '*.webp' {
    const src: string;
    export default src;
}

declare global {}
export const i = 3;
