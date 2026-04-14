# i18n Completion Design

**Date:** 2026-04-13
**Issue:** HCI-Design-Lab/a11y-logger#83

## Summary

Complete internationalization coverage for all four supported locales (en, fr, es, de). Three categories of work: (1) fill gaps in existing message files, (2) wire hardcoded component strings to next-intl, (3) populate translated criterion names in the DB seed for criteria tables.

---

## Section 1: Message File Completions

Three areas in `fr.json`, `es.json`, and `de.json` still contain English strings.

### 1a. `vpats.sections`
Ten VPAT section headings remain in English in all non-English files (e.g. "Table 1: Success Criteria, Level A"). Translate using official localized titles from the standards bodies where available (W3C for WCAG, ETSI for EN 301 549), and natural translations otherwise.

### 1b. `vpats.pdf`
Five strings in the PDF export sub-section are untranslated: "Export to PDF", "Generate a PDF export of this VPAT.", "Generate PDF", "Download PDF", "Generating…"

### 1c. `settings.language`
The language picker label and language names display in English regardless of locale. Each locale should display names in its own language (e.g. French locale shows "Langue", "Anglais", "Français", "Espagnol", "Allemand").

---

## Section 2: New i18n Keys for Hardcoded Component Strings

### 2a. `vpat-ai-panel.tsx`
Add keys under `vpats.ai_panel`:
- Title pattern: `"AI Analysis — {criterion_code}"`
- Label: `"Confidence"`
- Warning: `"Limited evidence — consider additional testing."`

Update the component to call `useTranslations('vpats.ai_panel')` and replace hardcoded strings with `t()` calls.

### 2b. `ai-config-section.tsx`
Add keys under `settings.ai`:
- `description`: the "Configure your AI provider…" intro paragraph
- `custom_provider_description`: the "Any API that follows the OpenAI chat format…" paragraph
- `show_api_key` / `hide_api_key`: aria-labels for the password visibility toggle

Update the component to use `t()` for all three.

### 2c. `report-edit-form.tsx`
The hardcoded `SECTION_LABELS` object maps section keys to English names. The translations already exist in `reports.sections` (e.g. `executive_summary_title`, `top_risks_title`). Replace the hardcoded object with a lookup that reads from the existing translation keys — no new keys needed.

### 2d. `vpat-shared.ts` / `criteria.ts` (server-side export utilities)
These files are not React components and cannot call `useTranslations()`. `SECTION_LABELS` and `CONFORMANCE_DISPLAY` constants are used by DOCX/HTML export functions.

Fix: update the export functions to accept a `translations` object parameter (containing the pre-looked-up strings from `vpats.sections` and `vpats.conformance`). The calling server action reads the locale from the user's session, fetches the translated strings via `getTranslations()`, and passes them in. The `vpats.sections` and `vpats.conformance` keys already exist in all message files.

### 2e. Standard group labels (`vpat-criteria-table.tsx`)
The labels "WCAG", "Section 508", and "EN 301 549" are internationally recognized proper names for these standards. They are intentionally left as-is and not translated.

---

## Section 3: Criteria Table Translations

### Current state
The DB schema has `name_fr`, `name_es`, `name_de` (and `description_fr/es/de`) columns on the `criteria` table. They are all `NULL` because `criteria-seed.ts` does not populate them. The UI falls back to the English `name` column when these are null.

### Seed changes
1. Expand `CriterionRow` and `NonWcagCriterionRow` tuple types in `criteria-seed.ts` to include optional translation fields.
2. Populate translated `name_fr`, `name_es`, `name_de` values for all criteria.
3. Update the INSERT SQL statements to write the translation columns.

### Translation sources and coverage

| Standard | fr | es | de |
|---|---|---|---|
| WCAG (78 criteria) | Official W3C French translation | Official W3C Spanish translation | No official W3C German translation → English fallback |
| EN 301 549 (~150 criteria) | Official ETSI French version | No official ETSI Spanish version → English fallback | Official ETSI German version |
| Section 508 (~100 criteria) | No official translation (US regulation) → English fallback | No official translation → English fallback | No official translation → English fallback |

English fallback is handled by the existing null-check in the UI — no code change needed for fallback behaviour.

### UI changes
Update the VPAT criteria display (vpat-criteria-table and related components) to select the locale-appropriate name column (`name_fr`, `name_es`, `name_de`) when the user's locale is not English. Where the translation column is null, fall back to `name`.

---

## Section 4: Testing

### Key integrity test
Add a test (co-located with the existing message file tests, or as a new `src/messages/__tests__/completeness.test.ts`) that asserts every key present in `en.json` also exists in `fr.json`, `es.json`, and `de.json`. This acts as a regression guard so future additions to `en.json` are caught immediately.

### Locale-switching integration test
Add tests to `src/i18n/request.ts` or its test file verifying:
- Each supported locale loads the correct message file
- An unknown locale falls back to English
- A missing key in a non-English file falls back gracefully

---

## Section 5: README Update

Add a note to the README's localization section documenting translation coverage:

- **Full translation (all UI strings):** French, Spanish, German
- **Criteria names — full:** WCAG in French and Spanish (official W3C translations); EN 301 549 in French and German (official ETSI translations)
- **Criteria names — English fallback:** WCAG in German (no official W3C German translation); EN 301 549 in Spanish (no official ETSI Spanish translation); all Section 508 criteria in all non-English locales (US federal regulation, English-only source)

---

## Out of Scope

- Translating `description_fr/es/de` fields on criteria (criterion descriptions are long technical text; translating them is a separate effort)
- Adding new locales beyond the existing four
- Translating AI-generated remarks content (generated at runtime by the configured AI provider)
