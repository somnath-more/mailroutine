# Careerflow Theme and Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Careerflow's reusable Atomic Design component system, responsive `MainTemplate`, persistent theme controls, static routes, and Storybook documentation without adding API behavior.

**Architecture:** React Router owns static screen routing inside `MainTemplate`; atomic components compose upward from atoms to molecules to Header/Sidebar organisms. A small theme provider persists `light | dark | system` locally and applies resolved semantic CSS tokens to the document. Storybook uses the React/Vite framework and the same providers/styles as the app.

**Tech Stack:** React 19, TypeScript 6, Vite 8, React Router, Lucide React, Storybook React/Vite, Storybook Docs/A11y/Themes addons, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-09-15-theme-layout-design.md`

## Global Constraints

- Work only on `feat/theme-layout` based on `main`.
- Name the application template `MainTemplate`; do not introduce `AppShell`.
- Add no backend changes, APIs, API clients, network calls, server state, authentication, or email behavior.
- Add no test-case files and do not rewrite the existing startup smoke test, per the user's explicit instruction.
- Keep every Atomic Design directory populated with implemented components; create no empty future modules.
- Persist theme preference under `careerflow-theme` and support only `light`, `dark`, and `system`.
- Storybook stories contain no assertions, play functions, mock APIs, or test-only behavior.
- Verification must include formatting, ESLint, TypeScript, the existing smoke test, the Vite build, and the static Storybook build.

---

### Task 1: Dependencies and theme foundation

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/package-lock.json`
- Create: `frontend/src/theme/theme-context.ts`
- Create: `frontend/src/theme/theme-storage.ts`
- Create: `frontend/src/theme/ThemeProvider.tsx`
- Create: `frontend/src/theme/useTheme.ts`
- Create: `frontend/src/app/providers.tsx`
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/src/styles/index.css`

**Interfaces:**
- Consumes: `window.localStorage`, `window.matchMedia('(prefers-color-scheme: dark)')`, and `document.documentElement.dataset.theme`.
- Produces: `ThemePreference = 'light' | 'dark' | 'system'`, `ResolvedTheme = 'light' | 'dark'`, `ThemeProvider`, `useTheme(): ThemeContextValue`, and `AppProviders`.

- [ ] **Step 1: Install runtime and Storybook dependencies**

From `frontend/`, run:

```bash
npm install react-router lucide-react
npm install --save-dev storybook @storybook/react-vite @storybook/addon-docs @storybook/addon-a11y @storybook/addon-themes
```

Use stable npm releases and commit the resulting `package-lock.json`.

- [ ] **Step 2: Implement safe theme storage and resolution**

Define these exact public types and functions:

```ts
export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = Exclude<ThemePreference, 'system'>

export const THEME_STORAGE_KEY = 'careerflow-theme'
export function readThemePreference(): ThemePreference
export function writeThemePreference(preference: ThemePreference): void
export function getSystemTheme(): ResolvedTheme
export function resolveTheme(preference: ThemePreference): ResolvedTheme
export function applyResolvedTheme(theme: ResolvedTheme): void
export function initializeTheme(): void
```

Validate stored strings explicitly. Wrap local-storage reads/writes in `try/catch`, fall back to `system`, and set both `data-theme` and CSS `color-scheme` when applying a resolved theme.

- [ ] **Step 3: Implement the provider and hook**

Create this context contract in `theme-context.ts`:

```ts
export interface ThemeContextValue {
  preference: ThemePreference
  resolvedTheme: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
}
```

`ThemeProvider` initializes from storage, listens for system-theme changes, applies the resolved value in a layout effect, and persists explicit user changes. `useTheme` returns the context or throws `useTheme must be used within ThemeProvider`.

- [ ] **Step 4: Compose providers and prevent startup theme flash**

Export `AppProviders({ children }: PropsWithChildren)` that renders `ThemeProvider`. Call `initializeTheme()` before `createRoot` in `main.tsx`; the existing App render remains inside React `StrictMode`.

- [ ] **Step 5: Establish semantic theme tokens**

Replace the setup-page-specific palette with tokens for canvas, surface, elevated surface, primary/muted text, border, brand, brand contrast, hover, focus, success, danger, and shadow. Define explicit `:root[data-theme='light']` and `:root[data-theme='dark']` values, shared reset/typography rules, responsive breakpoints, and reduced-motion behavior.

- [ ] **Step 6: Verify and checkpoint the theme foundation**

Run:

```bash
npm run format
npm run lint
npm run typecheck
```

Then commit:

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/theme frontend/src/app/providers.tsx frontend/src/main.tsx frontend/src/styles/index.css
git commit -m "feat: add persistent theme foundation"
```

---

### Task 2: Atomic components and stories

**Files:**
- Create: `frontend/src/components/atoms/Brand/Brand.tsx`
- Create: `frontend/src/components/atoms/Brand/Brand.stories.tsx`
- Create: `frontend/src/components/atoms/Button/Button.tsx`
- Create: `frontend/src/components/atoms/Button/Button.stories.tsx`
- Create: `frontend/src/components/atoms/IconButton/IconButton.tsx`
- Create: `frontend/src/components/atoms/IconButton/IconButton.stories.tsx`
- Create: `frontend/src/components/molecules/NavItem/NavItem.tsx`
- Create: `frontend/src/components/molecules/NavItem/NavItem.stories.tsx`
- Create: `frontend/src/components/molecules/PageHeader/PageHeader.tsx`
- Create: `frontend/src/components/molecules/PageHeader/PageHeader.stories.tsx`
- Create: `frontend/src/components/molecules/ThemeSwitcher/ThemeSwitcher.tsx`
- Create: `frontend/src/components/molecules/ThemeSwitcher/ThemeSwitcher.stories.tsx`
- Modify: `frontend/src/styles/index.css`

**Interfaces:**
- Consumes: React button attributes, React Router `NavLink`, Lucide icon components, and `useTheme`.
- Produces: `Brand`, `Button`, `IconButton`, `NavItem`, `PageHeader`, and `ThemeSwitcher`.

- [ ] **Step 1: Build the button and identity atoms**

Use these public prop contracts:

```ts
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium'
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}
```

`IconButton` sets `aria-label={label}` and defaults to `type="button"`. `Brand` renders a dashboard `NavLink`, a decorative `C` mark, and visible `Careerflow` text.

- [ ] **Step 2: Build navigation and page-header molecules**

Use these contracts:

```ts
export interface NavItemProps {
  icon: LucideIcon
  label: string
  to: string
  onNavigate?: () => void
}

export interface PageHeaderProps {
  eyebrow: string
  title: string
  description: string
}
```

`NavItem` uses `NavLink` and its active state; `PageHeader` renders an accessible title region with one `h1`.

- [ ] **Step 3: Build the theme-switcher molecule**

Render a visible `Theme` label, a palette icon, and a native select bound to `preference`. Options are `System`, `Light`, and `Dark`; changes call `setPreference` with a validated `ThemePreference`.

- [ ] **Step 4: Document atomic states in Storybook**

Create CSF stories typed with `Meta` and `StoryObj` for all six components. Cover button variants/sizes, labeled icon controls, the Brand, active-capable navigation, page-header copy, and the theme selector. Do not add `play` properties or assertions.

- [ ] **Step 5: Add shared atomic styles and checkpoint**

Style focus, disabled, hover, active-navigation, compact/mobile, and dark-theme states using semantic tokens only. Run formatting, ESLint, and TypeScript, then commit:

```bash
git add frontend/src/components frontend/src/styles/index.css
git commit -m "feat: add atomic navigation components"
```

---

### Task 3: Responsive organisms, MainTemplate, and static routes

**Files:**
- Create: `frontend/src/app/navigation.ts`
- Create: `frontend/src/app/router.tsx`
- Modify: `frontend/src/app/App.tsx`
- Create: `frontend/src/components/organisms/Header/Header.tsx`
- Create: `frontend/src/components/organisms/Header/Header.stories.tsx`
- Create: `frontend/src/components/organisms/Sidebar/Sidebar.tsx`
- Create: `frontend/src/components/organisms/Sidebar/Sidebar.stories.tsx`
- Create: `frontend/src/components/templates/MainTemplate/MainTemplate.tsx`
- Create: `frontend/src/components/templates/MainTemplate/MainTemplate.stories.tsx`
- Create: `frontend/src/pages/DashboardPage.tsx`
- Create: `frontend/src/pages/RecipientsPage.tsx`
- Create: `frontend/src/pages/TemplatesPage.tsx`
- Create: `frontend/src/pages/ComposePage.tsx`
- Create: `frontend/src/pages/HistoryPage.tsx`
- Modify: `frontend/src/styles/index.css`

**Interfaces:**
- Consumes: atomic components, `Outlet`, route location/navigation, and `AppProviders`.
- Produces: `navigationItems`, `Header`, `Sidebar`, `MainTemplate`, five static page components, `router`, and the root `App`.

- [ ] **Step 1: Define primary navigation**

Export this structure with Lucide icons:

```ts
export const navigationItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Recipients', to: '/recipients', icon: Users },
  { label: 'Templates', to: '/templates', icon: FileText },
  { label: 'Compose', to: '/compose', icon: Send },
  { label: 'History', to: '/history', icon: History },
] satisfies NavigationItem[]
```

- [ ] **Step 2: Build Header and Sidebar organisms**

`Header` accepts `isNavigationOpen: boolean` and `onNavigationToggle: () => void`, supplies an accessible mobile menu button, and renders `ThemeSwitcher`. `Sidebar` accepts `isOpen: boolean` and `onClose: () => void`, renders the Brand and primary `nav`, and invokes `onClose` after a navigation click.

- [ ] **Step 3: Build MainTemplate responsive behavior**

`MainTemplate` owns `isNavigationOpen`. It closes on Escape via a cleaned-up document listener, closes from the overlay, passes close behavior into Sidebar, and renders route content inside `<main id="main-content"><Outlet /></main>`.

- [ ] **Step 4: Build the five static screens**

Use `PageHeader` and honest static empty-state cards. Dashboard renders the exact heading `Careerflow` and exact text `Project foundation is ready.` to preserve the existing smoke test. Other screens explain their upcoming feature scope without invented records or statuses.

- [ ] **Step 5: Configure application routing**

Create a browser router with `MainTemplate` as the layout route, the five screen paths from the specification, and `Navigate replace to="/"` for unknown paths. `App` renders `AppProviders` around `RouterProvider`.

- [ ] **Step 6: Add organism/template stories**

Create typed stories for Header closed/open controls, Sidebar desktop/mobile states, and MainTemplate containing the Dashboard route. Use Storybook decorators for router context; add no interactions or assertions.

- [ ] **Step 7: Complete responsive layout styles and checkpoint**

Implement a persistent desktop sidebar and mobile overlay drawer at the shared breakpoint. Ensure landmarks, focus rings, scroll behavior, and reduced motion remain accessible. Run format, lint, type-check, the existing test, and the Vite build, then commit:

```bash
git add frontend/src
git commit -m "feat: add responsive routed main template"
```

---

### Task 4: Storybook configuration, documentation, CI, and final verification

**Files:**
- Create: `frontend/.storybook/main.ts`
- Create: `frontend/.storybook/preview.tsx`
- Modify: `frontend/.prettierignore`
- Modify: `.gitignore`
- Modify: `frontend/package.json`
- Modify: `frontend/package-lock.json`
- Modify: `frontend/README.md`
- Create: `docs/frontend-architecture.md`
- Modify: `docs/roadmap.md`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: all component stories, `ThemeProvider`, React Router memory context, global styles, and current CI frontend scripts.
- Produces: `npm run storybook`, `npm run build-storybook`, static Storybook output ignored at `storybook-static/`, architecture guidance, and a CI Storybook build gate.

- [ ] **Step 1: Configure Storybook React/Vite**

Set `.storybook/main.ts` to load `../src/**/*.stories.@(ts|tsx)`, enable Docs/A11y/Themes addons, and use `@storybook/react-vite`. Set `.storybook/preview.tsx` to import global CSS and apply `MemoryRouter`, `ThemeProvider`, centered/padded layout defaults, generated docs tags, and `withThemeByDataAttribute` for `light`/`dark` using `data-theme`.

- [ ] **Step 2: Add Storybook scripts and ignore output**

Add:

```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

Ignore `frontend/storybook-static/` in the root Git ignore file and Prettier ignore file.

- [ ] **Step 3: Document frontend architecture and commands**

Document Atomic Design promotion rules, exact component locations, route ownership, semantic-token requirements, the theme storage contract, story colocation, and `npm run storybook`/`npm run build-storybook`. Update the roadmap so project setup is complete and `feat/theme-layout` is current.

- [ ] **Step 4: Add Storybook to CI**

Append `npm run build-storybook` after the frontend production build in `.github/workflows/ci.yml`. Do not add a Storybook deployment job.

- [ ] **Step 5: Run complete verification**

From `frontend/`, run:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run build-storybook
```

Inspect the application at desktop and mobile viewport widths and switch through light, dark, and system themes. Confirm no backend file changed with `git diff main...HEAD -- backend`.

- [ ] **Step 6: Commit the completed feature**

```bash
git add .github .gitignore frontend docs/frontend-architecture.md docs/roadmap.md docs/superpowers/plans/2026-09-15-theme-layout.md
git commit -m "docs: document frontend layout system"
```
