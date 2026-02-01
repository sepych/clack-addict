# AGENTS.md

Instructions for AI agents working on this `ClackAddict` project.

## Project Context
`ClackAddict` is a terminal-based typing speed test application.
It relies on `@opentui/core` for TUI rendering and `bun` for the runtime/toolchain.
The project prioritizes clean, strict TypeScript code and a modular architecture.

## Environment & Setup
- **Runtime**: Bun (latest)
- **Language**: TypeScript (Strict mode)
- **Module System**: ES Modules (`type: "module"`)

## Build, Test & Lint Commands

### Running the Application
To start the TUI application (dev mode):
```bash
bun run index.ts
```

### Testing
Run all tests using Bun's built-in test runner:
```bash
bun test
```

Run a specific test file (absolute or relative path):
```bash
bun test src/core/TypingEngine.test.ts
```

Run tests matching a string pattern (e.g., all user-related tests):
```bash
bun test "user"
```

### Type Checking & Linting
Since this project uses Bun with `module: "Preserve"`, we use `tsc` for type verification and `eslint` for code quality.
**Always run these before committing.**
```bash
# Type check
bun x tsc --noEmit

# Lint
bun run lint
```

### Dependency Management
Install dependencies (generates `bun.lock`):
```bash
bun install
```

## Project Structure

```
├── index.ts                  # Main application entry point & loop
├── index.test.ts             # Integration tests for main app flow
├── src
│   ├── config
│   │   ├── text.ts           # Text samples/generators
│   │   └── theme.ts          # Color themes (bg, correct, incorrect)
│   ├── core
│   │   └── TypingEngine.ts   # Game logic (WPM, accuracy, state)
│   └── ui
│       ├── TextRenderer.ts   # Visual text rendering logic
│       └── FireComponent.ts  # Visual effects components
├── package.json              # Dependencies (@opentui/core)
├── tsconfig.json             # TypeScript config (strict)
└── AGENTS.md                 # This file
```

## Code Style Guidelines

### 1. Imports
- **Format**: Use ES modules (`import`/`export`).
- **Extensions**: Import TypeScript files with `.ts` extension (enabled by `allowImportingTsExtensions`).
- **Style**: Prefer named imports for clarity.
- **Ordering**: 
  1. External libraries (`@opentui/core`, `bun:test`)
  2. Internal absolute/relative imports

```typescript
// Good
import { createCliRenderer, Box } from "@opentui/core";
import { TypingEngine } from "./src/core/TypingEngine.ts";

// Bad (CommonJS or implicit extensions)
const { Box } = require("@opentui/core");
import { TypingEngine } from "./src/core/TypingEngine"; 
```

### 2. Types & TypeScript
- **Strict Mode**: `strict: true` is enabled. No `any` types.
- **Explicit Types**: Define return types for functions.
- **Safety**: 
  - `noUncheckedIndexedAccess`: Check for `undefined` on array access.
  - `noImplicitOverride`: Use `override` keyword for subclass methods.
  - `noFallthroughCasesInSwitch`: Prevent accidental fallthroughs.

```typescript
type GameState = "PLAYING" | "COMPLETE";

interface GameConfig {
  wpm: number;
  readonly targetScore: number;
}

function calculateScore(config: GameConfig): number {
  return config.wpm * 100;
}
```

### 3. Naming Conventions
- **Variables/Functions**: `camelCase` (e.g., `updateDisplay`, `calculateWpm`).
- **Classes/Interfaces/Types**: `PascalCase` (e.g., `TypingEngine`, `GameState`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`).
- **Files**: PascalCase for classes/components (`FireComponent.ts`), camelCase for utilities (`text.ts`).

### 4. Formatting
- **Indentation**: 2 spaces.
- **Semicolons**: Avoid trailing semicolons (Bun/Standard JS style), but stay consistent.
- **Quotes**: Prefer double quotes `"` unless single quotes avoid escaping.
- **Line Length**: ~100 characters.

### 5. Error Handling
- Use typed custom errors where possible.
- Avoid silent failures; log or rethrow.
- Use early returns (`if (!valid) return;`) to reduce nesting.

## @opentui/core Development Guidelines

### Component Layout
Use the `Box` primitive for flexbox-like layouts.
```typescript
const app = Box(
  {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.bg
  },
  header,
  mainContent
);
```

### Input Handling
- Use `keypress` event on `renderer.keyInput`.
- Handle `ctrl+c` manually to exit.
- `keyEvent.name` -> Logical key ("escape", "return", "backspace").
- `keyEvent.sequence` -> Typed character ("a", "A", " ").

```typescript
renderer.keyInput.on("keypress", (keyEvent) => {
  if (keyEvent.name === "escape") {
    renderer.destroy();
    process.exit(0);
  }
});
```

### Rendering
- State changes do not auto-render. Call `renderer.requestRender()` after updating content.
- Use `TextRenderable` for dynamic text and `StyledText` for colors.

## Testing Strategy
- **Framework**: `bun:test`
- **Location**: Co-locate tests (e.g., `TypingEngine.test.ts` next to `TypingEngine.ts`).
- **Structure**: `describe` -> `it` -> `expect`.

```typescript
import { describe, it, expect } from "bun:test";

describe("TypingEngine", () => {
  it("calculates WPM correctly", () => {
    const engine = new TypingEngine("test");
    expect(engine.wpm).toBe(0);
  });
});
```

## Pre-commit Checklist
1. [ ] **Type Check**: Run `bun x tsc --noEmit` - Ensure 0 errors.
2. [ ] **Lint**: Run `bun run lint` - Ensure 0 errors.
3. [ ] **Test**: Run `bun test` - Ensure all tests pass.
4. [ ] **Verify**: Run `bun run index.ts` - Check UI and Input manually.
4. [ ] **Cleanup**: Remove `console.log` debugging artifacts.
5. [ ] **Update**: Update `AGENTS.md` if adding new tools or patterns.
