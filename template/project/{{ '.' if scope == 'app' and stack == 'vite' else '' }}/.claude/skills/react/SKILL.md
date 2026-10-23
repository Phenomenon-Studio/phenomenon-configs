---
name: react
description: Build clean, modern React components that apply common best practices and avoid common pitfalls like unnecessary state management or useEffect usage.
user-invocable: false
---

# Writing React Components

Modern React 19+ with React Compiler. Focus on clarity, correctness, and maintainability.

## Component Definition

- **USE** function declarations for named components (ESLint-enforced):
  ```tsx
  function UserProfile({ name, role }: UserProfileProps) {
      return <div>...</div>;
  }
  export { UserProfile };
  ```
- **DO NOT** use arrow functions for component definitions
- **DO NOT** use default exports for components
- Keep components small, focused, single-responsibility
- Keep JSX flat and readable; avoid deep nesting
- **USE** self-closing tags for components and HTML elements without children
- **DO NOT** use useless fragments (`<>...</>` wrapping a single element)

## TypeScript & Imports

- **USE** `type` keyword for type-only imports (ESLint-enforced):
  ```tsx
  import type { ReactNode } from 'react';
  import type { UserProfileProps } from './types';
  ```
- **USE** `React.ComponentProps<'element'>` for extending HTML element props
- **USE** arrow functions with braces for all non-component functions (ESLint `arrow-body-style: always`):
  ```tsx
  const handleClick = () => { doSomething(); };
  const getValue = (x: number) => { return x * 2; };
  ```
- **DO NOT** use nested ternaries (ESLint-enforced)

## State Management

- **AVOID** `useEffect` — see [You Might Not Need An Effect](references/you-dont-need-useeffect.md)
- **PREFER** deriving values during render instead of synchronizing state
- Fetch data via TanStack Query, not raw effects
- **AVOID** unnecessary `useState` / `useReducer` — derive from props or other state when possible
- Localize state to the lowest possible component
- **DO NOT** mirror props in state unless absolutely necessary
- Prefer controlled components over syncing uncontrolled state

## Effects & Side Effects

- When effects are unavoidable, **USE** named functions for callbacks (ESLint-enforced):
  ```tsx
  useEffect(function syncThemeWithDOM() {
      document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useLayoutEffect(function removeInitialStyle() {
      node.remove();
  }, []);
  ```
- **AVOID** effects for: derived state, data transformations, event-based logic
- Keep effects minimal, isolated, with proper cleanup
- Prefer framework abstractions (TanStack Router/Query) over raw effects

## Event Handling

- **PREFER** named handlers over inline arrow functions in JSX:
  ```tsx
  const handleSubmit = () => { /* ... */ };
  <form onSubmit={handleSubmit}>
  ```
- Name handlers clearly: `handleSubmit`, `handleChange`, `handleClose`
- Keep handlers small; extract complex logic into helpers

## Refs (React 19)

- **DO NOT** use `forwardRef` — it is deprecated (ESLint-enforced)
- **PASS** `ref` as a regular prop — `React.ComponentProps` already includes `ref`:
  ```tsx
  function CustomInput(props: React.ComponentProps<'input'>) {
      return <input {...props} />;
  }
  ```
- When exposing imperative APIs, use `useImperativeHandle` with a named function callback
- Use `useRef` only for values that don't affect rendering (DOM nodes, timers, IDs)

## Performance (React Compiler)

- **DO NOT** manually use `memo`, `useMemo`, or `useCallback` — React Compiler handles memoization
- Only add manual memoization if you have **measured** a proven performance issue
- Keep keys stable and meaningful when rendering lists
- Keep render logic deterministic and free of side effects

## Context

- Use React 19's `use()` hook for reading context (can be called conditionally, unlike `useContext`)
- Always wrap context consumption in a custom hook with a runtime guard via `useSafeContext`
- Use `displayName` on all context objects for DevTools debugging

## Props & Composition

- **PREFER** composition over configuration
- **AVOID** excessive boolean props; prefer expressive APIs
- Use `children` intentionally; type as `ReactNode`
- Keep prop names semantic and predictable

## Principles

- Write code for humans first, compilers second
- Prefer explicitness over cleverness
- Optimize for readability and long-term maintenance
- If a pattern feels complex, reconsider the component boundary
