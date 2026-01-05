Here is a deeper dive focused on state management and UI composition/layout, with the key files to read.

State Management
- Store wiring lives in src/store/index.ts: configureStore combines slices, prepends a listener middleware, and appends a dynamic middleware registry from src/store/middleware/dynamic-middleware.ts. The listener middleware logs most actions into the history slice.
- Typed hooks in src/store/hooks.ts (useAppDispatch, useAppSelector) are the main bridge between UI and Redux.
- Domain slices:
  - Game state in src/store/game/game-slice.ts tracks phase/day/winner and the active script; selectors expose phase and display time.
  - Grimoire state in src/store/grimoire/grimoire-slice.ts manages seats, demon bluffs, out-of-play roles, and reminder tokens; it recalculates drunk/poisoned status via a dependency walk when tokens change.
  - Voting in src/store/voting/voting-slice.ts is a state machine with derived selectors for eligible voters and vote thresholds (depends on state.grimoire.seats).
  - History in src/store/history/history-slice.ts stores log entries; it is primarily fed by the listener middleware.
  - AI orchestration in src/store/ai-orchestrator/ai-orchestrator-slice.ts is a queued async pipeline that builds prompts, estimates cost, calls /api/ai/*, and can pull tasks from the storyteller queue.
  - Storyteller queue in src/store/st-queue/st-queue-slice.ts is a task queue with thunks for runNextTask and runTasks, including a "pause for human" path.
- Note: the storyteller queue file currently mixes queue with items/currentItem in selectors/exports; that mismatch is worth reconciling if you plan to use the slice as-is.

UI Composition and Layout
- Root shell is assembled in src/routes/__root.tsx: HTML head, CSS injection, Redux Provider, and AppShell wrapper. This is where global layout and devtools are mounted.
- src/components/AppShell.tsx composes the main chrome: AppSidebar, TopBar, BottomBar, and a HistoryPanel overlay. SidebarInset is the only place that touches viewport height (h-svh).
- The sidebar system is a full layout component in src/components/ui/sidebar.tsx: context-driven open/close, cookie persistence, off-canvas mobile via Radix Sheet, and a collapsible icon variant. AppSidebar in src/components/AppSidebar.tsx is just a menu composition on top.
- TopBar in src/components/TopBar.tsx uses Radix dropdowns/sheets and src/data/editions.json to render a scripts menu; it also exposes a mobile nav via a sheet trigger.
- The main visual scene is src/components/TownSquare.tsx: it is a computed, radial layout that positions tokens around a circle. It pulls script from the game slice, merges it with player roles, and computes night-order badges. UI controls are a draggable, local-state panel; preferences persist to localStorage and can be exported.
- Token rendering is abstracted in src/components/CharacterTokenParent.tsx with a data-attribute-driven styling model (alive/dead, alignment, character type) plus overlays (src/components/ShadedOverlay.tsx, src/components/OverlayElement.tsx) and badges.

If you want, I can map out the data flow for a specific UI (e.g., voting, grimoire tokens, or the AI orchestrator) step-by-step.
