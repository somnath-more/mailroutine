# Careerflow Theme and Layout Design

## Purpose

Create the reusable frontend structure that all Careerflow screens will use: Atomic Design component boundaries, responsive navigation, persistent light/dark/system themes, static route scaffolding, and Storybook component documentation. This branch does not add or call backend APIs.

## Scope and acceptance criteria

The feature is complete when:

- Work is isolated on `feat/theme-layout` from the current `main` branch.
- Frontend components are organized into atoms, molecules, organisms, and templates without empty placeholder directories.
- The reusable application template is named `MainTemplate`.
- A responsive Header and Sidebar provide navigation for the initial email-management screens.
- Light, dark, and system theme choices are available, persisted locally, and applied through semantic CSS tokens.
- React Router renders static Dashboard, Recipients, Templates, Compose, and History screens inside `MainTemplate`.
- Storybook runs with React/Vite and documents the reusable components and important layout states.
- Formatting, linting, TypeScript, the production frontend build, the existing startup test, and the static Storybook build succeed.
- No backend file, API client, query hook, or network call is added.

## Selected approach

Use a pragmatic Atomic Design hierarchy:

```text
frontend/src/
├── app/
│   ├── App.tsx
│   ├── providers.tsx
│   └── router.tsx
├── components/
│   ├── atoms/
│   │   ├── Brand/
│   │   ├── Button/
│   │   └── IconButton/
│   ├── molecules/
│   │   ├── NavItem/
│   │   ├── PageHeader/
│   │   └── ThemeSwitcher/
│   ├── organisms/
│   │   ├── Header/
│   │   └── Sidebar/
│   └── templates/
│       └── MainTemplate/
├── pages/
│   ├── ComposePage.tsx
│   ├── DashboardPage.tsx
│   ├── HistoryPage.tsx
│   ├── RecipientsPage.tsx
│   └── TemplatesPage.tsx
├── theme/
│   ├── ThemeProvider.tsx
│   ├── theme-storage.ts
│   └── useTheme.ts
└── styles/
    └── index.css
```

Every directory contains an implemented component. Components that exist only for one page stay with that page in later feature branches rather than being promoted prematurely.

## Component responsibilities

### Atoms

- `Brand` renders the Careerflow identity and links to the dashboard.
- `Button` supplies typed button variants needed by the shell and future forms.
- `IconButton` requires an accessible label and provides the compact control used for mobile navigation.

### Molecules

- `NavItem` combines an icon, label, and React Router navigation state.
- `PageHeader` gives static screens a consistent title, eyebrow, and description region.
- `ThemeSwitcher` exposes light, dark, and system choices through a labeled select control.

### Organisms

- `Header` contains the mobile menu control, current-area context, and theme switcher.
- `Sidebar` contains the Brand, primary navigation, and a compact launch-scope note. It supports desktop presentation and a controlled mobile drawer.

### Template

- `MainTemplate` owns mobile navigation state, composes Header and Sidebar, closes the drawer after navigation, closes it on overlay click or Escape, and renders route content through React Router's `Outlet`.

## Routes and static screens

Use the current declarative React Router package with these routes:

| Path | Screen | Purpose in this branch |
| --- | --- | --- |
| `/` | Dashboard | Summarize the email-release foundation without fetching data |
| `/recipients` | Recipients | Explain that recipient import and viewing arrive in their feature branches |
| `/templates` | Templates | Reserve the template-management workspace |
| `/compose` | Compose | Reserve the deliberate email-composition workflow |
| `/history` | History | Reserve immutable sending-history presentation |

Screens contain helpful static empty-state copy only. They do not simulate records, loading, success, or API results. The Dashboard keeps the existing `Careerflow` heading and `Project foundation is ready.` text so the already-committed startup smoke test remains valid without writing new test code.

## Theme behavior

Define `ThemePreference` as `light | dark | system` and persist it under `careerflow-theme`. `ThemeProvider` resolves system mode with `prefers-color-scheme`, updates when that media query changes, and writes the resolved `light` or `dark` value to `document.documentElement.dataset.theme`.

Storage reads and writes must fail safely when browser privacy settings make local storage unavailable. Theme initialization runs before React renders to reduce visible theme changes during startup. Components consume theme state only through `useTheme`, which throws a clear error outside the provider.

Global styles use semantic variables for background, surface, text, muted text, borders, brand, hover, focus, success, danger, and shadows. Components never scatter raw palette values through JSX. System preferences for reduced motion are respected.

## Responsive and accessible behavior

- At desktop width, the Sidebar is persistently visible and the Header omits its menu button.
- At smaller widths, the Sidebar becomes a modal-style drawer with an overlay.
- The drawer closes via its close button, overlay click, Escape key, or successful navigation.
- Landmarks use `header`, `nav`, `aside`, and `main` elements with clear accessible labels.
- Icon-only controls require labels, current navigation uses `aria-current`, and focus visibility is preserved.
- The initial static layout uses no remote fonts, images, mock data, or network resources.

## Storybook configuration

Install the latest stable Storybook channel with `@storybook/react-vite`, `@storybook/addon-docs`, `@storybook/addon-a11y`, and `@storybook/addon-themes`. Commit the resolved npm lockfile.

Add `storybook` and `build-storybook` scripts. Configure `.storybook/main.ts` for colocated `*.stories.tsx` files and React/Vite. Configure `.storybook/preview.tsx` to load global styles, provide routing and `ThemeProvider`, enable automatic documentation, and expose light/dark rendering through the `data-theme` attribute.

Provide stories for Button, IconButton, Brand, NavItem, PageHeader, ThemeSwitcher, Header, Sidebar, and MainTemplate. Stories show meaningful component states but do not contain assertions, play functions, mocked APIs, or test-only behavior.

## Error handling

- Unknown URLs redirect to the Dashboard because the product has no not-found experience yet.
- Invalid or missing stored theme values fall back to `system`.
- Browser storage exceptions leave the selected theme active for the current session.
- Storybook supplies MemoryRouter and ThemeProvider context globally so connected components render consistently.

## Verification

Per the user's instruction, this branch will not add or rewrite test-case files. The existing startup smoke test remains unchanged and must continue to pass.

Run:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run build-storybook
```

Review the production layout at desktop and mobile widths and confirm light, dark, and system theme behavior. Storybook must load the documented components without build errors.

## Documentation changes

- Update the frontend README with Storybook commands and the Atomic Design directory rules.
- Add a focused frontend architecture document covering component promotion, theme tokens, routes, and Storybook story placement.
- Update the roadmap to mark project setup complete and `feat/theme-layout` current.

## Explicit exclusions

Do not add backend APIs, Axios, TanStack Query, server state, authentication, permissions, database code, real recipients, templates, sending behavior, history records, Storybook interaction tests, or new automated test cases.
