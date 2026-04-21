# AI Prompt i18n Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make all AI-generated content (issue analysis, VPAT rows, report sections) output in the user's selected locale by injecting a language instruction into every AI system prompt.

**Architecture:** The client sends its locale in the POST body. A pure `getLanguageName()` helper maps the locale code to a full language name. `VercelAIProvider` accepts an optional `language` constructor param and appends `"Respond entirely in {language}."` to every system prompt. `getAIProvider()` threads language through. Each API route extracts `locale` from the request body (optional, defaults to `"en"`) and passes the mapped language name to `getAIProvider()`. Client components include `locale` from `useLocale()` in their fetch bodies.

**Tech Stack:** next-intl (`useLocale`), Vercel AI SDK (`generateText`), Next.js App Router API routes

---

### Task 1: Create language helper and update the AI provider layer

**Files:**
- Create: `src/lib/ai/language.ts`
- Modify: `src/lib/ai/vercel-provider.ts`
- Modify: `src/lib/ai/index.ts`

**Step 1: Create `src/lib/ai/language.ts`**

```ts
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
};

export function getLanguageName(locale: string): string {
  return LANGUAGE_NAMES[locale] ?? 'English';
}
```

**Step 2: Update `VercelAIProvider` in `src/lib/ai/vercel-provider.ts`**

Add an optional `language` constructor param (defaults to `'English'`) and a private helper that appends the language instruction to any system prompt:

```ts
export class VercelAIProvider implements AIProvider {
  constructor(
    private model: LanguageModel,
    private language: string = 'English'
  ) {}

  private withLanguage(system: string): string {
    return `${system}\n\nRespond entirely in ${this.language}.`;
  }
```

Then in every `generateText` call that has a `system:` field, wrap it:
- `system: ANALYZE_ISSUE_SYSTEM` → `system: this.withLanguage(ANALYZE_ISSUE_SYSTEM)`
- `system: REPORT_WRITER_SYSTEM` → `system: this.withLanguage(REPORT_WRITER_SYSTEM)`
- `system: EXECUTIVE_SUMMARY_SYSTEM` → `system: this.withLanguage(EXECUTIVE_SUMMARY_SYSTEM)`
- `system: VPAT_REMARKS_SYSTEM` → `system: this.withLanguage(VPAT_REMARKS_SYSTEM)`
- The `buildVpatRowPrompt()` call — that function returns `{ system, prompt }`. Wrap the system field after calling the builder.
- The `buildVpatReviewPrompt()` call — same pattern.

Read the full file before editing to get exact line numbers. There are approximately 6 `generateText` calls total (one per method: `analyzeIssue`, `generateReportSection`, `generateExecutiveSummaryHtml`, `generateVpatRemarks`, `generateVpatRow`, `reviewVpatRow`).

**Step 3: Update `getAIProvider()` in `src/lib/ai/index.ts`**

Add an optional `language` parameter and pass it to the `VercelAIProvider` constructor:

```ts
export function getAIProvider(task: AITask, language?: string): AIProvider | null {
  // ... existing provider selection logic ...
  // When constructing VercelAIProvider, pass language:
  return new VercelAIProvider(model, language ?? 'English');
}
```

Read the full file first to understand the existing return statements.

**Step 4: Run tests**

```bash
npm test -- "ai\|provider\|language"
```

Fix any failures.

**Step 5: Commit**

```bash
git commit -m "feat(i18n): add language-aware AI provider layer"
```

---

### Task 2: Update API routes to pass locale to the provider

**Files (6 routes — skip `generate-vpat-narrative` which has no active callers):**
- Modify: `src/app/api/ai/generate-issue/route.ts`
- Modify: `src/app/api/ai/report/executive-summary/route.ts`
- Modify: `src/app/api/ai/report/quick-wins/route.ts`
- Modify: `src/app/api/ai/report/top-risks/route.ts`
- Modify: `src/app/api/ai/report/user-impact/route.ts`
- Modify: `src/app/api/vpats/[id]/rows/[rowId]/generate/route.ts`
- Modify: `src/app/api/vpats/[id]/rows/generate-all/route.ts`

**Pattern for each route:**

Add import at top:
```ts
import { getLanguageName } from '@/lib/ai/language';
```

In the request body destructuring, extract `locale`:
```ts
const { ..., locale } = body as { ..., locale?: unknown };
const language = getLanguageName(typeof locale === 'string' ? locale : 'en');
```

Pass `language` to `getAIProvider()`:
```ts
const ai = getAIProvider('issues', language);
// or 'reports', 'vpat', 'vpat_review' etc.
```

**For `generate-issue/route.ts`:**
Current body destructuring:
```ts
const { ai_description, current = {} } = body as { ... };
```
Add `locale` to the destructuring.

**For the 4 report routes (executive-summary, quick-wins, top-risks, user-impact):**
Each currently destructures `{ reportId }` from the body. Add `locale` to each.

**For `rows/[rowId]/generate/route.ts`:**
This route currently has `const body = await request.json()` (or similar). Add `locale` extraction before calling `getAIProvider('vpat', language)`. Note this route also calls `getAIProvider('vpat_review', language)` for the review pass — pass language to both.

**For `rows/generate-all/route.ts`:**
Same pattern as the single-row route.

**Step 1: Read each route file** before editing to understand exact body parsing structure.

**Step 2: Apply the pattern to all 7 routes.**

**Step 3: Run tests**

```bash
npm test -- "route\|api"
```

Fix any failures by updating test mocks that call these routes — they should pass a `locale` field (or verify the route handles missing `locale` gracefully, defaulting to `'English'`).

**Step 4: Commit**

```bash
git commit -m "feat(i18n): thread locale through AI generation API routes"
```

---

### Task 3: Update client components to send locale in fetch body

**Files:**
- Modify: `src/components/issues/issue-form.tsx`
- Modify: `src/components/reports/report-edit-form.tsx`
- Modify: `src/app/(app)/vpats/[id]/edit/page.tsx`

**`src/components/issues/issue-form.tsx`:**

The component already imports `useTranslations` from `next-intl`. Add `useLocale`:
```ts
import { useLocale, useTranslations } from 'next-intl';
```

Inside the component function:
```ts
const locale = useLocale();
```

In the fetch call around line 137, add `locale` to the JSON body:
```ts
body: JSON.stringify({
  ai_description: aiDescription,
  locale,
  current: { ... },
}),
```

**`src/components/reports/report-edit-form.tsx`:**

The component already imports `useTranslations` from `next-intl`. Add `useLocale`:
```ts
import { useLocale, useTranslations } from 'next-intl';
```

Inside the component:
```ts
const locale = useLocale();
```

In the fetch call around line 114 (the `generate` handler that uses `endpointMap`):
```ts
body: JSON.stringify({ reportId: report.id, locale }),
```

**`src/app/(app)/vpats/[id]/edit/page.tsx`:**

The file already loads `locale` into state (line 54: `const [locale, setLocale] = useState('en')`). It's fetched from the VPAT data. Use this existing `locale` state.

In `handleGenerateRow` (around line 209):
```ts
const res = await fetch(`/api/vpats/${vpatId}/rows/${rowId}/generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ locale }),
});
```

In `handleGenerateAll` (around line 253), the bare `{ method: 'POST' }` call:
```ts
const res = await fetch(`/api/vpats/${vpatId}/rows/${row.id}/generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ locale }),
});
```

**Step 1: Read each file** before editing.

**Step 2: Apply the changes.**

**Step 3: Run tests**

```bash
npm test
```

Fix any failures — test files that mock these components' fetch calls may need `locale` added to expected request bodies.

**Step 4: Commit**

```bash
git commit -m "feat(i18n): send locale in AI generation fetch requests"
```

---

### Task 4: Final verification

**Step 1: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

**Step 2: Full test suite**

```bash
npm test
```

Expected: all 232 test files pass.

**Step 3: Manual smoke test** (optional but recommended)

If a dev server is available, switch the locale to French, generate a VPAT row or issue analysis, and verify the output is in French.
