# Vector Editor — Project Rules

## Prompt Logging

Conversation logging is automatic via two hooks in `.claude/settings.json`:

- **`UserPromptSubmit`** → `.claude/hooks/log-prompt.sh` — appends each user prompt to both `AI_PROMPT.md` and `AI_PROMPT_WITH_ANSWER.md`
- **`Stop`** → `.claude/hooks/log-response.sh` — appends Claude's response to `AI_PROMPT_WITH_ANSWER.md`

| File | Contents |
|------|----------|
| `AI_PROMPT.md` | User prompts only |
| `AI_PROMPT_WITH_ANSWER.md` | User prompts + Claude's responses |

No manual action is needed — hooks fire automatically on every interaction.

## Project Stack

- **Runtime**: Node.js 24
- **Package manager**: pnpm
- **Framework**: React 18 + TypeScript
- **Build**: Vite 7
- **State**: Zustand
- **Testing**: Vitest

## Available Skills

| Skill | Command | Description |
|-------|---------|-------------|
| verify | `/verify` | Run tests + type-check in parallel, report errors |
| add-mock | `/add-mock` | Generate random points and polygons on the canvas |
| remove-mock | `/remove-mock` | Remove all mock shape data, restore clean state |

## Architecture

- **Command Pattern** for undo/redo (`src/history/`)
- **Strategy Pattern** for modes (`src/modes/`)
- **Zustand store** accessed imperatively from plain TS classes (`src/store/`)
- **Inline SVG** for rendering with native hit-detection (`src/components/`)

## Commands

```bash
pnpm dev        # start dev server
pnpm build      # type-check + production build
pnpm test       # run all tests
pnpm test:watch # tests in watch mode
```
