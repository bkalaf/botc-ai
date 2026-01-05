Plan: Describe src exports & architecture

TL;DR: Produce a comprehensive, per-file and per-module description of `./src` covering exported functions/types, relationships, key flows (build/game/AI checks), and a type-callmap. Output: a human-readable Markdown doc plus a machine-readable JSON index.

### Steps
1. Generate per-file summaries: one-line purpose and exported symbols for every file under [src](src), referencing `routeTree`, `gameSlice`, `createPrompt`.  
2. Produce module overviews: group files into modules (components, store, prompts, server, assets, memory) and summarize responsibilities.  
3. Build the type network: list top types (`IGame`, `ISeat`, `PromptSpec`, `RootState`, `STTask`) with definition locations and usage sites.  
4. Create call-graph & key flows: map thunk → server-check → prompt flows (e.g., `executeDemonBluffs` → `checkDemonBluffs` → `prompts/demonBluffs`) and highlight cycles.  
5. Deliver artifacts: single Markdown doc (with per-file appendix) and JSON index (files/modules/types/call-edges). Example source refs: [src/router.tsx](src/router.tsx), [src/store/index.ts](src/store/index.ts), [src/prompts/_genericStorytellerCore.ts](src/prompts/_genericStorytellerCore.ts).

### Further Considerations
1. Output format choice? Option A: Markdown + JSON (recommended). Option B: split per-module Markdown files.  
2. Diagrams desired? I can include Mermaid call graphs if you want.

This is a draft — confirm output format and whether to include diagrams, then I’ll generate the full descriptive document.
