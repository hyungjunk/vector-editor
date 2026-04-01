# Interactive Vector Editor — Implementation Plan

## Context

Build an interactive vector editor from scratch. The editor must support 4 modes (Point, Polygon, Move, Delete) with full undo/redo, plus automated tests.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         App.tsx (Shell)                           │
│                                                                  │
│  ┌──────────────┐        ┌─────────────────────────────────────┐ │
│  │   Toolbar     │        │          Canvas (SVG)               │ │
│  │              │        │                                     │ │
│  │ [Point]      │        │   <PointShape />  <PolygonShape />  │ │
│  │ [Polygon]    │        │                                     │ │
│  │ [Move]       │        │   click / drag events               │ │
│  │ [Delete]     │        │          │                          │ │
│  │ ────────     │        └──────────┼──────────────────────────┘ │
│  │ [Undo][Redo] │                   │                            │
│  │ [Complete]   │                   ▼                            │
│  └──────────────┘        ┌─────────────────────┐                 │
│                          │ Active ModeController│                 │
│                          │ (Strategy Pattern)   │                 │
│                          └────────┬────────────┘                 │
│                                   │ creates Commands             │
│                                   ▼                              │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │              HistoryManager (Command Pattern)             │   │
│  │   undoStack: Command[]     redoStack: Command[]           │   │
│  │   execute(cmd) → cmd.execute() + push undo               │   │
│  │   undo()       → pop undo, cmd.undo(), push redo          │   │
│  │   redo()       → pop redo, cmd.execute(), push undo       │   │
│  └───────────────────────┬───────────────────────────────────┘   │
│                          │ mutates                               │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                Zustand Store (editorStore)                 │   │
│  │  shapes[]  │  currentMode  │  selectedId  │  pendingVerts │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow (single interaction)

1. User clicks SVG canvas → browser fires event on SVG element
2. `Canvas.tsx` computes canvas-relative coords, identifies hit shape via `data-shape-id`
3. Delegates to active `ModeController.onCanvasClick(coords, hitShape)`
4. ModeController creates a `Command` (e.g., `AddShapeCommand`)
5. `historyManager.execute(cmd)` → calls `cmd.execute()`, pushes to undo stack, clears redo
6. `cmd.execute()` mutates Zustand store (add/remove/move shape)
7. Store update triggers React re-render → SVG updates

### Design Patterns

- **Command Pattern** for undo/redo: each action is a reversible object with `execute()` and `undo()`
- **Strategy Pattern** for modes: `ModeController` interface swapped at runtime based on toolbar selection
- **SVG as hit-detection engine**: browser handles point-in-shape tests natively via DOM events — no manual geometry needed

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | React 18 + TypeScript | Declarative UI binding for toolbar state, SVG diffing; TS gives type safety for geometric types and discriminated unions |
| **Rendering** | Inline SVG (no library) | Free hit-detection (events fire on `<circle>`/`<polygon>`), React can diff individual elements, zero bundle weight vs Konva (140KB) or Fabric.js (300KB) |
| **State** | Zustand | 1KB, `getState()`/`setState()` work outside React (critical — Commands and ModeControllers are plain classes, not components). Context API re-renders all consumers; Redux is too ceremonious |
| **Build** | Vite 7 | Instant dev server, native TS via esbuild, Vitest integration |
| **Testing** | Vitest | Shares Vite config, Jest-compatible API, faster than Jest for TS |
| **Package mgr** | pnpm | Fast, disk-efficient via content-addressable store, strict dependency resolution, `pnpm-lock.yaml` satisfies lockfile requirement |
| **Node** | 24 | Latest current release |

---

## File Structure

```
vector-editor/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── AI_PROMPTS.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── types/
│   │   └── index.ts              # Shape, Point, Polygon, Mode, Command, Coords
│   ├── store/
│   │   └── editorStore.ts        # Zustand store: shapes, mode, selection, pending
│   ├── history/
│   │   ├── historyManager.ts     # Undo/redo stack engine
│   │   └── commands.ts           # AddShape, DeleteShape, MoveShape commands
│   ├── modes/
│   │   ├── ModeController.ts     # Strategy interface
│   │   ├── PointMode.ts
│   │   ├── PolygonMode.ts
│   │   ├── MoveMode.ts
│   │   └── DeleteMode.ts
│   ├── components/
│   │   ├── Toolbar.tsx
│   │   ├── Canvas.tsx
│   │   ├── PointShape.tsx
│   │   └── PolygonShape.tsx
│   └── utils/
│       └── geometry.ts           # distance, centroid, offsetShape
└── tests/
    ├── history.test.ts
    ├── commands.test.ts
    ├── store.test.ts
    ├── modes.test.ts
    └── geometry.test.ts
```

---

## Implementation Phases

### Phase 1: Project Scaffolding
- `pnpm create vite@latest` with React + TypeScript template (Vite 7)
- Install `zustand`
- Set up directory structure and `src/types/index.ts`
- Verify `pnpm dev` boots and `pnpm test` runs

### Phase 2: Core Logic (pure, testable, no UI)
- `editorStore.ts` — Zustand store with shapes CRUD, mode, pending vertices
- `historyManager.ts` — undo/redo stack
- `commands.ts` — AddShape, DeleteShape, MoveShape
- `geometry.ts` — distance, centroid, offsetShape
- **Write all unit tests** for these modules

### Phase 3: Canvas Rendering
- `PointShape.tsx` — renders `<circle>` with `data-shape-id`
- `PolygonShape.tsx` — renders `<polygon>` with vertex dots
- `Canvas.tsx` — SVG viewport, maps store shapes to components
- `App.tsx` — shell composing Toolbar + Canvas
- Seed store with hardcoded shapes to verify rendering

### Phase 4: Point Mode + Mode System
- `ModeController.ts` interface
- `PointMode.ts` — click → create point via AddShapeCommand
- Wire Canvas event delegation to active ModeController
- Basic Toolbar with mode buttons

### Phase 5: Polygon Mode
- `PolygonMode.ts` — click adds vertex to pending, Complete finalizes
- Pending polygon preview (dashed polyline) in Canvas
- "Complete Polygon" button in Toolbar (visible when >= 3 vertices)

### Phase 6: Move Mode
- `MoveMode.ts` — mousedown records start, mousemove updates live, mouseup creates MoveShapeCommand
- Support dragging both points and polygons

### Phase 7: Delete Mode
- `DeleteMode.ts` — click on shape → DeleteShapeCommand

### Phase 8: Undo/Redo + Polish
- Wire Undo/Redo toolbar buttons
- Keyboard shortcuts: Ctrl+Z / Ctrl+Shift+Z (Cmd on Mac)
- Visual feedback: hover highlights, selection, cursor changes per mode
- Clear pending polygon on mode switch

### Phase 9: Documentation
- `README.md` with Node version, package manager, install/dev/test commands
- `AI_PROMPTS.md`

---

## Verification

1. `npm run dev` — app boots, canvas renders
2. **Point Mode**: click canvas → circles appear
3. **Polygon Mode**: click 3+ points → click Complete → polygon appears with fill
4. **Move Mode**: drag any shape → it follows the cursor
5. **Delete Mode**: click any shape → it disappears
6. **Undo/Redo**: create 3 points → undo 3 times → all gone → redo 3 times → all back
7. **Cross-operation undo**: create point → move it → undo → point returns to original position → undo → point deleted
8. `npm test` — all tests pass (history, commands, store, modes, geometry)
