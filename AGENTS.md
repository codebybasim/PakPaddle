This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Premium UI/UX & Animation Standards

This project must deliver distinctive, polished, modern mobile experiences—not generic AI-generated interfaces.

### Design Direction
- Design with the quality of a top-tier consumer mobile product.
- Avoid generic layouts, repetitive card grids, excessive rounded rectangles, default purple/blue gradients, and template-looking screens.
- Choose colors intentionally for the product and brand. Use strong typography, expressive composition, deliberate spacing, layered surfaces, and high-quality imagery where appropriate.
- Make each screen visually distinctive while preserving a coherent application-wide design language.
- Do not add gradients, glassmorphism, shadows, or decorative effects unless they improve the design.
- Prioritize visual hierarchy, usability, accessibility, and content clarity over decoration.

### Installed Design Skills
Project-local skills are available under `.agents/skills/`.

Before relevant tasks, inspect and follow the instructions in:
- `.agents/skills/ui-ux-pro-max/SKILL.md`
- `.agents/skills/expo-animation/SKILL.md`
- `.agents/skills/expo-design-system/SKILL.md`

Read any supporting files referenced by these skills when needed. If a skill is unavailable or its instructions conflict with the current project architecture, explain the issue and use a compatible alternative. Do not claim to have used a skill unless its instructions were actually read.

Use UI/UX Pro Max for design direction and visual decisions, Expo Animation for motion and interactions, and Expo Design System for reusable design tokens and components.

### Motion & Interaction
- Treat animation as part of the user experience, not as decoration.
- Use Expo-compatible animation and gesture libraries based on the installed SDK and React Native versions.
- Build fluid screen transitions, spring-based interactions, responsive press states, gesture-driven components, progressive content reveals, and polished loading and success states where appropriate.
- Use haptic feedback for meaningful actions when supported.
- Prefer performant native/UI-thread animation patterns where appropriate.
- Avoid excessive motion, animation that blocks user actions, and unnecessary continuous effects.
- Respect accessibility and reduced-motion preferences.

### Design System
- Establish reusable semantic color tokens, typography scales, spacing, radii, elevations, and motion principles.
- Use NativeWind and the existing styling architecture unless a deliberate, justified change is necessary.
- Reuse components for consistency without forcing every screen into the same layout.
- Include loading, empty, error, disabled, and success states for relevant interactions.
- Support safe areas, different screen sizes, keyboard behavior, and both iOS and Android.

### Required UI Implementation Workflow
1. Inspect the relevant screens, routes, components, dependencies, and existing design conventions before editing.
2. Read and apply the relevant installed skills.
3. For substantial redesigns, establish the visual direction and design system before implementing screens.
4. Preserve existing business logic, API contracts, navigation, and working features.
5. Implement functional interactions, not just static visual changes.
6. Test the experience on an emulator or device when available.
7. Run the existing lint and typecheck commands before declaring the task complete.
8. Report any untested behavior, compatibility risks, or remaining issues honestly.

### Quality Bar
Do not settle for a basic functional interface when the task calls for a polished experience. Review hierarchy, spacing, typography, interaction feedback, animation quality, responsiveness, accessibility, and performance before finishing.

For small changes, follow this standard without unnecessarily redesigning unrelated screens. For large redesigns, work incrementally and validate each major screen before expanding the changes.