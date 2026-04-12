# Fracta — Architecture decision log

Short ADR-style entries. Status: **Accepted** unless noted.

---

## ADR-001 — Single storage key `fm_progress`

**Context:** Profiles and tracks need a canonical persisted document.

**Decision:** Keep the existing `localStorage` key `fm_progress` for the full app root object (`schemaVersion`, `activeProfileId`, `profiles`). Do not rename to `fm_state` in v1.

**Consequences:** Docs and users keep one key; migration must handle all legacy shapes reading this key.

---

## ADR-002 — Profile model and stable IDs

**Context:** Multiple children share one device/browser profile.

**Decision:** Root stores `profiles` keyed by `player_1` and `player_2`. Each profile owns `fractions`, `arithmetic`, and `accessibility` (e.g. dyslexia-friendly font).

**Consequences:** Progress is isolated per player; schema can later add more keys without breaking IDs.

---

## ADR-003 — Global language

**Context:** Catalan-first product; optional per-player language later.

**Decision:** `fm_language` remains device-global, not stored per profile in v1.

**Consequences:** Simpler migration and settings; one language toggle for the household.

---

## ADR-004 — Ordered migration pipeline

**Context:** Legacy flat progress and intermediate shapes must not corrupt saves.

**Decision:** All reads go through `migrateRawToAppState` in `src/utils/storage/migrate.js` (idempotent, current `SCHEMA_VERSION`).

**Consequences:** Tests target migration directly; UI never parses legacy shapes.

---

## ADR-005 — Player switch behaviour

**Context:** Wrong `gameQuestions` could remain in memory after switching players.

**Decision:** Changing `activeProfileId` persists immediately, clears in-memory game session, and navigates to **home** (or equivalent safe screen).

**Consequences:** Small UX reset on switch; avoids cross-player answer state.

---

## ADR-006 — Decision log location

**Context:** Team asked for a durable log of decisions.

**Decision:** Maintain this file at `docs/DECISION_LOG.md` and add ADRs when storage or cross-cutting behaviour changes.

**Consequences:** README/ARCHITECTURE may reference this file without duplicating full rationale.

---

## ADR-007 — Arithmetic track badges (no speed)

**Context:** Arithmetic targets younger learners; speed-based rewards are hidden.

**Decision:** Point-badge evaluation for the arithmetic track excludes `speed_demon`. Level badges reuse the same milestone definitions per level number where applicable.

**Consequences:** `checkNewBadges` and related helpers take an explicit `track` argument.
