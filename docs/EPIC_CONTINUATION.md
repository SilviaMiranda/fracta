# Fracta: profiles + arithmetic epic — continuation guide

Use this file when resuming work in a new Cursor session. It maps the agreed epic plan to the codebase **as of the branch that contains this commit**.

## Plan reference (not edited in-repo)

Slices were defined in the Cursor plan **Fracta Profiles Arithmetic** (Player 1/2, nested `fractions` / `arithmetic` per profile, Catalan-first arithmetic, dyslexia toggle, badges without speed on arithmetic, etc.).

## Implemented (done)

### Storage and migration

- **Canonical `fm_progress` shape** (`schemaVersion: 4`): `activeProfileId`, `profiles.player_1` / `profiles.player_2`, each profile has `fractions`, `arithmetic`, and `accessibility` (e.g. `dyslexiaFont`).
- **Migration**: legacy flat progress → wrapped into `player_1.fractions`; idempotent pipeline in [`src/utils/storage/migrate.js`](src/utils/storage/migrate.js).
- **API**: [`src/utils/storage.js`](src/utils/storage.js) — `loadAppState`, `saveAppState`, `loadProgress` / `saveProgress` (fractions track), `loadArithmeticProgress` / `saveArithmeticProgress`, `loadAccessibility` / `saveAccessibility`, `switchToProfile`, `resetActiveProfileGameProgress` (via App callback for settings).
- **Tests**: [`src/utils/storage/migrate.test.js`](src/utils/storage/migrate.test.js).

### Track configuration

- [`src/utils/trackConfig.js`](src/utils/trackConfig.js) — `TRACK_FRACTIONS`, `TRACK_ARITHMETIC`, `getTrackConfig` (level counts, questions per level, onboarding question count), `maxPointsForTrack`.

### Questions

- **Modular layout**: [`src/utils/questions/fractions.js`](src/utils/questions/fractions.js), [`src/utils/questions/arithmetic.js`](src/utils/questions/arithmetic.js), [`src/utils/questions/index.js`](src/utils/questions/index.js); [`src/utils/questions.js`](src/utils/questions.js) re-exports.
- **`generateQuestion(level, lang, track)`** and **`checkAnswer(user, correct, track)`** with default track fractions.
- **Arithmetic**: Catalan-first word stems + facts; `arithmeticStartingLevel` for arithmetic onboarding placement.
- **Tests**: [`src/utils/questions/arithmetic.test.js`](src/utils/questions/arithmetic.test.js).
- **Fractions**: `visualRepresent` only for levels 1–3; proper fractions only for visual (keeps `questions.test.js` expectations).

### Badges

- [`src/utils/badges.js`](src/utils/badges.js) — `getPointBadgesForTrack`, `getLevelBadgesForTrack`, `checkNewBadges` / `getEarnedBadges` / `getTotalBadgeCount` / `getAllBadgesWithStatus` accept `track`; arithmetic point badges **exclude** `speed_demon` (ADR-007 in decision log).

### UI / App

- [`src/App.jsx`](src/App.jsx) — loads `appState`, **always opens `home`** (no auto-redirect to fraction onboarding on boot), `activeTrack`, player switch clears game session and returns home, dyslexia class on root, `navigateTo` regenerates game questions when missing, passes track into game/complete/levels/onboarding.
- [`src/screens/HomeScreen.jsx`](src/screens/HomeScreen.jsx) — Player 1/2, separate **Fractions** vs **Arithmetic** entry (continue vs start onboarding per track).
- [`src/screens/SettingsScreen.jsx`](src/screens/SettingsScreen.jsx) — player switch, dyslexia toggle, reset active player (both tracks + keeps accessibility), earned badges split by track.
- [`src/screens/LevelMenuScreen.jsx`](src/screens/LevelMenuScreen.jsx), [`GameScreen.jsx`](src/screens/GameScreen.jsx), [`LevelCompleteScreen.jsx`](src/screens/LevelCompleteScreen.jsx), [`OnboardingScreen.jsx`](src/screens/OnboardingScreen.jsx) — track-aware copy, scoring, max points, level counts, navigation with `track` in payload where needed.
- [`src/components/BadgesModal.jsx`](src/components/BadgesModal.jsx) — `track` prop for badge grid.

### i18n and accessibility

- [`src/utils/translations.js`](src/utils/translations.js) — player UI, arithmetic section strings, `arithLevel1`–`arithLevel12`, arithmetic onboarding title/description, placeholders, dyslexia label, reset copy (en/ca/de/es).
- [`tailwind.config.js`](tailwind.config.js) — `fontFamily.atkinson`.
- [`index.html`](index.html) — Google Fonts link for Atkinson Hyperlegible.

### Documentation

- [`docs/DECISION_LOG.md`](docs/DECISION_LOG.md) — ADR-001–007.

### Dependencies

- `package-lock.json` refreshed after `npm install` so `vitest` and peers resolve locally (fixes `ERR_MODULE_NOT_FOUND` for Vitest).

## Not done / follow-up (for next session)

1. **`FractionVisualizer.test.jsx`** — ~14 tests still fail (e.g. `getAllByText(/1\/4/)`); likely DOM/query assumptions vs current `FractionVisualizer` markup. **Unit suite**: `questions` + `migrate` + `arithmetic` tests pass; full `vitest --run` still exits non-zero until these are fixed or updated.
2. **README / ARCHITECTURE.md** — not updated for profiles, dual tracks, new storage shape, or `npm test` prerequisites. Worth a short PR pass to align docs with code.
3. **Optional product polish** — `storage` event listener for multi-tab sync (plan risk table); per-player language (ADR-003 deferred); export/import progress.
4. **Epic slice checklist** (if you still use the old todo list) — all major slices are **landed in one implementation wave** on this branch; future work is mostly tests + docs + any product tweaks.

## Commands (verify locally)

```bash
cd fracta
npm install
npm test        # expect FractionVisualizer failures until fixed
npm run build
```

## Key files for “where is X?”

| Concern | Location |
|--------|----------|
| Persisted shape / migration | `src/utils/storage/migrate.js`, `src/utils/storage.js` |
| Track constants | `src/utils/trackConfig.js` |
| Question routing | `src/utils/questions/index.js` |
| Player switch | `App.jsx` `handleSwitchPlayer`, `switchToProfile` in `storage.js` |
| Catalan arithmetic stems | `src/utils/questions/arithmetic.js` |
