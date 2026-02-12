# Constitution

Every rule in this document is mandatory. No exceptions.

## Code Style

### Spell It Out

Use full, descriptive names for variables, parameters, and properties. `context` over `ctx`, `episode` over `ep`,
`index` over `idx`.

### Clear Steps

Break complex expressions into named intermediate variables. Each line should do one thing and be immediately
understandable. If an expression spans multiple lines or requires tracing operator precedence, split it up.

### Name Your Handlers

Define callbacks as named functions in the body. If a handler has logic beyond a single expression, extract it and give
it a name.

### Always Spread

When enriching an object, spread the original and add the new fields.

## Types

### Strict Types

Give every data shape a named type. Use real types, never `any`. Keep types flat — no inline definitions, no nesting.
Prefer `Array<Type>` over `Type[]` for readability. Every function must have explicit parameter types and return
types — never rely on inference for signatures.

### Say What You Mean

Function signatures and implementations tell the truth. If an operation can fail, the return type reflects that and the
implementation follows through.

## Architecture

### Single Job

Every function, component, and module has one responsibility. Logic lives in the layer that owns it.

### Atomic Components

Break components down to singular, independent pieces. Each component is self-contained with minimal coupling to its
siblings. Extract shared markup into its own component before duplicating it.

### Organize By Feature

Each feature gets its own directory containing everything it needs — components, utilities, types, and tests. You should
be able to understand a feature by looking at one directory. Only truly shared code lives outside feature boundaries.

## Framework

### Docs First

Review Svelte and SvelteKit documentation before implementing. Understand the framework's contracts and guarantees so
you don't write code that works around problems that don't exist. Use `context7` MCP server for fetching up-to-date documentation.

### Be Explicit

Prefer callbacks or — better still — function bindings over `$effect`. Reserve `$effect` as an escape hatch for things
like analytics and direct DOM manipulation, not as a primary tool.

## Workflow

### Done Means Done

A task is complete when the linter passes and the build succeeds. Fix the root cause of every warning and error.

### Less Is More

Think before writing. Read the existing implementation, understand what it does, and make the changes the situation
actually calls for — no more, no less. Don't rewrite what already works, and don't produce volume for the sake of
progress.

### No Shortcuts

Never skip steps, hack around a problem, or produce a partial fix to move on faster. When a problem feels too large or
too complex, break it into smaller, manageable chunks and work through them methodically. If the path forward is unclear,
stop and collaborate — explain the difficulty, lay out the options, and decide on an approach together before writing
code.

### Approval Before Commit

Before committing, provide a summary of all changes and wait for explicit approval.
