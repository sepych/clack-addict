# AGENTS.md

Instructions for AI agents working on this tui-monkeytype project.

## Build/Test Commands

Run the application:
```bash
bun run index.ts
```

Run all tests (Bun has built-in test runner):
```bash
bun test
```

Run a single test file:
```bash
bun test path/to/file.test.ts
```

Type check (no explicit command, uses tsconfig.json):
```bash
bun run index.ts --check
```

Install dependencies:
```bash
bun install
```

## Project Structure

```
├── index.ts           # Main entry point
├── package.json       # Dependencies (@opentui/core)
├── tsconfig.json      # TypeScript configuration (strict mode)
├── bun.lock           # Lockfile for dependencies
└── README.md          # Basic project info
```

## Code Style Guidelines

### Imports
- Use ES modules (`import/export`)
- Import TypeScript files with `.ts` extension allowed (`allowImportingTsExtensions: true`)
- Prefer explicit imports over namespace imports

### Types
- Strict TypeScript enabled (`strict: true`)
- Use explicit types for function parameters and return values
- Enable `noUncheckedIndexedAccess` - handle undefined when accessing array/object indices
- Enable `noImplicitOverride` - use `override` keyword when overriding methods
- Enable `noFallthroughCasesInSwitch` - prevent switch case fallthrough bugs

### Naming Conventions
- Use `camelCase` for variables, functions, and methods
- Use `PascalCase` for classes, interfaces, types, and enums
- Use `UPPER_SNAKE_CASE` for constants
- Use descriptive names; avoid abbreviations unless well-known

### Error Handling
- Use typed errors where possible
- Handle all switch cases explicitly
- Check for undefined values from index access operations
- Use early returns to reduce nesting

### Code Patterns
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Use template literals for string concatenation
- Prefer destructuring for objects/arrays

### Formatting
- 2-space indentation (follow Bun conventions)
- No trailing semicolons (optional, be consistent)
- Max line length: ~100 characters
- Use single quotes for strings

## @opentui/core Guidelines

This project uses `@opentui/core` for terminal UI development.

Key imports:
```typescript
import { ... } from "@opentui/core";
```

Testing utilities available:
```typescript
import { ... } from "@opentui/core/testing";
```

## Testing

- Bun has a built-in test runner (Jest-like syntax)
- Test files: `*.test.ts` or `*.spec.ts`
- Use `describe`, `it`, `expect` from Bun's test API
- Run single test: `bun test <pattern>`

Example:
```typescript
import { describe, it, expect } from "bun:test";

describe("feature", () => {
  it("should work", () => {
    expect(true).toBe(true);
  });
});
```

## Module System

- ES modules only (`"type": "module"` in package.json)
- `module: "Preserve"` in tsconfig.json
- Import paths use bundler resolution

## Pre-commit Checklist

Before completing tasks:
- [ ] Code runs without TypeScript errors
- [ ] Tests pass: `bun test`
- [ ] Application runs: `bun run index.ts`
- [ ] No unused imports or variables
