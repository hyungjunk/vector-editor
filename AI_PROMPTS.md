# AI Prompts with Answers

All user prompts and Claude's responses from conversations.

---

**User:**
> Let me give you a project idea and we will implement this. Plan out first and execute it when I give you a sign.

**Claude:**
> I'm ready to hear your project idea. Go ahead and describe it, and I'll put together a plan before we start building.

---

**User:**
> What we are going to build is in @goal.md, read the document first and plan out the steps to build the project. While doing so
> - Broad overview of this project in diagram. What the core controller is, how each controller interacts to another.
> - Choose the technical stacks such as what library you are using to build this project, and the reasons to select the one over if there were any competitors.
> - Any materials that helps to understand the project.

**Claude:**
> Designed the full architecture plan with: ASCII architecture diagram showing App Shell → Toolbar + Canvas → ModeController (Strategy Pattern) → HistoryManager (Command Pattern) → Zustand Store. Selected tech stack: React 18 + TypeScript, Inline SVG (no library), Zustand, Vite 5, Vitest, npm, Node 20 LTS. Created PLAN.md with 9 implementation phases and a verification checklist.

---

**User:**
> Update the plan to use the vite version 7, node version 24, and pnpm.
> Start building it after that.

**Claude:**
> Updated both plan files to use Vite 7, Node 24, and pnpm. Built the entire project from scratch:
> - Types, Zustand store, HistoryManager, Commands (AddShape, DeleteShape, MoveShape)
> - 4 ModeControllers: PointMode, PolygonMode, MoveMode, DeleteMode
> - SVG Canvas with hit-detection, Toolbar with mode buttons and undo/redo
> - Keyboard shortcuts (Cmd+Z / Cmd+Shift+Z)
> - Geometry utilities (distance, centroid, offsetShape)
> - 45 unit tests across 5 test files — all passing
> - README.md and AI_PROMPTS.md documentation

---

**User:**
> Create a skill only for this project
> - verify: Run the test and verify there is no type error. It can spawn multiple agents.
> - add-mock: Randomly generate shapes and reflect those on the web.
> - remove-mock: clear the generated mock shapes.
>
> And also create a CLAUDE.md file to with the first guide that does
> - Everytime there was chat between you and me, save it at AI_PROMPTS.md file. if you can use the hook, feel free to use this feature.

**Claude:**
> Created 3 project skills in `.claude/skills/`:
> - `/verify` — spawns 2 agents in parallel (type-check + tests), summarizes results
> - `/add-mock` — generates random points & polygons, wires into App.tsx on mount
> - `/remove-mock` — deletes mock file, cleans App.tsx import
>
> Created `CLAUDE.md` with project rules, stack info, and available skills.
> Created `.claude/hooks/log-prompt.sh` with `UserPromptSubmit` hook to auto-log prompts to AI_PROMPTS.md.

---

**User:**
> Save all my prompts to AI_PROMPT.md file, create another one AI_PROMPT_WITH_ANSWER.md. The former is only my prompt and the latter should include your response.

**Claude:**
> Created both files backfilled with all conversation history. Set up two hooks: `UserPromptSubmit` logs prompts to both files, `Stop` appends Claude's response to `AI_PROMPT_WITH_ANSWER.md`. Updated CLAUDE.md.

---

**User:**
> Change this repository to public and give me repo link

**Claude:**
> Changed repo to public: https://github.com/hyungjunk/vector-editor

---

**User:**
> Go ahead.

**Claude:**
> Ran `gh repo edit --visibility public --accept-visibility-change-consequences`. Done.

---

**User:**
> Read our goal guide file and check if it meets all the things described.

**Claude:**
> Verified all requirements against the codebase. All functional requirements (4 modes, undo/redo), technical requirements (tests, AI_PROMPTS.md), and README requirements (Node version, package manager, lockfile, commands) pass. One issue: AI prompts file was named `AI_PROMPT.md` instead of required `AI_PROMPTS.md`. Repo naming passes — no forbidden keywords.

---

**User:**
> Yes go ahead. And remove unnecessary additional info in README.md

**Claude:**
> Renamed `AI_PROMPT.md` → `AI_PROMPTS.md`. Trimmed README to only the required fields: Node version, package manager, install, dev, and test commands.
