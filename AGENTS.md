# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds application code (React + TypeScript).
- `src/routes/` contains TanStack Router file-based routes; `src/routeTree.gen.ts` is generated.
- `src/components/` and `src/components/ui/` contain shared UI building blocks.
- `src/store/` contains state slices and store setup.
- `src/data/` holds static JSON data and types.
- `src/assets/` holds images, icons, and fonts; `public/` is for static assets served as-is.

## Build, Test, and Development Commands
- `npm run dev` (or `yarn dev`): start Vite dev server on port 3000.
- `npm run build`: build the production bundle.
- `npm run preview`: serve the production build locally.
- `npm run lint`: run ESLint checks.
- `npm run format`: run Prettier.
- `npm run check`: format then auto-fix lint issues.
- `npm run test`: run Jest tests.
- `npm run check:circular`: detect circular imports in `src/`.

## Coding Style & Naming Conventions
- Language: TypeScript + React; keep components in `PascalCase` (e.g., `RoleLabel.tsx`).
- Indentation: follow Prettier defaults (2 spaces); run `npm run format` before committing.
- Styling: Tailwind CSS; prefer utility classes in components and keep global styles in `src/styles.css`.
- Paths: use the existing path aliases from `tsconfig.json` when applicable.

## Testing Guidelines
- Framework: Jest with `ts-jest` (`jest.config.js`).
- Naming: place tests as `*.test.ts`/`*.test.tsx` or `*.spec.ts`/`*.spec.tsx` near the code or in `__tests__/`.
- Coverage: no explicit thresholds configured; add focused tests for new logic.

## Commit & Pull Request Guidelines
- Commit messages are short and imperative; some use Conventional Commits like `feat(ui): ...`. Prefer that pattern for user-facing changes.
- PRs should include: a clear summary, linked issue (if any), and screenshots/GIFs for UI changes.
- Call out any new commands, env vars, or migrations in the PR description.

## Configuration & Environment
- Environment variables are defined via `src/env.ts`; keep new vars typed and documented.
- If you add new assets, place them under `src/assets/` and reference via imports rather than hard-coded paths.
