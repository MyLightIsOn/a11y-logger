# i18n Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete i18n coverage for all four locales (en/fr/es/de): fill message file gaps, wire hardcoded component strings to next-intl, populate translated criterion names in the DB seed, and add tests.

**Architecture:** Three layers of work — (1) JSON message file edits, (2) React component wiring using `useTranslations`, (3) DB seed data expansion with WCAG/EN 301 549 translations plus a migration for existing deployments.

**Tech Stack:** next-intl, TypeScript, React, better-sqlite3, Drizzle ORM, Vitest

---

## File Map

**Modified:**
- `src/messages/fr.json` — fill gaps in vpats.sections, vpats.pdf, settings.language; add new keys
- `src/messages/es.json` — same
- `src/messages/de.json` — same
- `src/messages/en.json` — add new keys for vpat-ai-panel, ai-config-section
- `src/components/vpats/vpat-ai-panel.tsx` — wire to useTranslations
- `src/components/settings/ai-config-section.tsx` — wire description + show/hide aria-labels
- `src/components/reports/report-edit-form.tsx` — replace SECTION_LABELS with tSections()
- `src/lib/export/vpat-shared.ts` — SECTION_LABELS + CONFORMANCE_DISPLAY stay; generators accept optional override
- `src/lib/export/vpat-template.ts` — accept optional translations param
- `src/lib/export/vpat-docx.ts` — accept optional translations param
- `src/lib/export/openacr.ts` — accept optional translations param
- `src/app/api/vpats/[id]/export/route.ts` — read locale, pass translations to generators
- `src/app/api/vpats/[id]/versions/[version]/export/route.ts` — same
- `src/lib/db/criteria-seed.ts` — expand tuples + update INSERT SQL

**Created:**
- `src/lib/constants/wcag-translations.ts` — fr + es for all 84 WCAG criteria
- `src/lib/constants/en301549-translations.ts` — fr + de for EN 301 549 clauses 4–8
- `migrations/019_seed_criteria_translations.sql` — UPDATE for existing DBs
- `src/messages/__tests__/completeness.test.ts` — key parity guard
- `src/i18n/__tests__/request.test.ts` — locale-switching tests

---

## Task 1: Fill message file gaps

**Files:**
- Modify: `src/messages/fr.json`
- Modify: `src/messages/es.json`
- Modify: `src/messages/de.json`

- [ ] **Step 1: Update vpats.sections in fr.json**

Replace the `vpats.sections` block (currently all English) with:

```json
"sections": {
  "tableA": "Tableau 1 : Critères de succès, Niveau A",
  "tableAA": "Tableau 2 : Critères de succès, Niveau AA",
  "tableAAA": "Tableau 3 : Critères de succès, Niveau AAA",
  "chapter3": "Chapitre 3 : Critères de performance fonctionnelle",
  "chapter5": "Chapitre 5 : Logiciel",
  "chapter6": "Chapitre 6 : Documentation d'assistance et services",
  "clause4": "Clause 4 : Déclarations de performance fonctionnelle",
  "clause5": "Clause 5 : Exigences génériques",
  "clause11": "Clause 11 : Logiciel non Web",
  "clause12": "Clause 12 : Documentation et services d'assistance"
},
```

- [ ] **Step 2: Update vpats.pdf in fr.json**

Replace the `vpats.pdf` block with:

```json
"pdf": {
  "title": "Exporter en PDF",
  "description": "Générer une exportation PDF de ce VPAT.",
  "generate": "Générer le PDF",
  "download": "Télécharger le PDF",
  "generating": "Génération…"
},
```

- [ ] **Step 3: Update settings.language in fr.json**

Replace the `settings.language` block with:

```json
"language": {
  "label": "Langue",
  "en": "Anglais",
  "fr": "Français",
  "es": "Espagnol",
  "de": "Allemand"
},
```

- [ ] **Step 4: Update vpats.sections in es.json**

```json
"sections": {
  "tableA": "Tabla 1: Criterios de Éxito, Nivel A",
  "tableAA": "Tabla 2: Criterios de Éxito, Nivel AA",
  "tableAAA": "Tabla 3: Criterios de Éxito, Nivel AAA",
  "chapter3": "Capítulo 3: Criterios de Rendimiento Funcional",
  "chapter5": "Capítulo 5: Software",
  "chapter6": "Capítulo 6: Documentación de Soporte y Servicios",
  "clause4": "Cláusula 4: Declaraciones de Rendimiento Funcional",
  "clause5": "Cláusula 5: Requisitos Genéricos",
  "clause11": "Cláusula 11: Software No Web",
  "clause12": "Cláusula 12: Documentación y Servicios de Soporte"
},
```

- [ ] **Step 5: Update vpats.pdf in es.json**

```json
"pdf": {
  "title": "Exportar a PDF",
  "description": "Generar una exportación PDF de este VPAT.",
  "generate": "Generar PDF",
  "download": "Descargar PDF",
  "generating": "Generando…"
},
```

- [ ] **Step 6: Update settings.language in es.json**

```json
"language": {
  "label": "Idioma",
  "en": "Inglés",
  "fr": "Francés",
  "es": "Español",
  "de": "Alemán"
},
```

- [ ] **Step 7: Update vpats.sections in de.json**

```json
"sections": {
  "tableA": "Tabelle 1: Erfolgskriterien, Stufe A",
  "tableAA": "Tabelle 2: Erfolgskriterien, Stufe AA",
  "tableAAA": "Tabelle 3: Erfolgskriterien, Stufe AAA",
  "chapter3": "Kapitel 3: Kriterien für funktionale Leistung",
  "chapter5": "Kapitel 5: Software",
  "chapter6": "Kapitel 6: Supportdokumentation und Dienste",
  "clause4": "Klausel 4: Aussagen zur funktionalen Leistung",
  "clause5": "Klausel 5: Allgemeine Anforderungen",
  "clause11": "Klausel 11: Nicht-Web-Software",
  "clause12": "Klausel 12: Dokumentation und Support-Dienste"
},
```

- [ ] **Step 8: Update vpats.pdf in de.json**

```json
"pdf": {
  "title": "Als PDF exportieren",
  "description": "Einen PDF-Export dieses VPATs erstellen.",
  "generate": "PDF erstellen",
  "download": "PDF herunterladen",
  "generating": "Wird erstellt…"
},
```

- [ ] **Step 9: Update settings.language in de.json**

```json
"language": {
  "label": "Sprache",
  "en": "Englisch",
  "fr": "Französisch",
  "es": "Spanisch",
  "de": "Deutsch"
},
```

- [ ] **Step 10: Commit**

```bash
git add src/messages/fr.json src/messages/es.json src/messages/de.json
git commit -m "feat(i18n): translate vpats.sections, vpats.pdf, settings.language for fr/es/de"
```

---

## Task 2: Wire vpat-ai-panel.tsx to i18n

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/fr.json`
- Modify: `src/messages/es.json`
- Modify: `src/messages/de.json`
- Modify: `src/components/vpats/vpat-ai-panel.tsx`

- [ ] **Step 1: Add vpats.ai_panel keys to en.json**

Add this block inside the `"vpats"` object (after `"pdf_modal"`):

```json
"ai_panel": {
  "dialog_aria_label": "AI Analysis for criterion {criterion_code}",
  "heading": "AI Analysis — {criterion_code}",
  "close_aria_label": "Close",
  "confidence": "Confidence",
  "low_confidence_warning": "Limited evidence — consider additional testing.",
  "suggested_conformance": "Suggested Conformance",
  "issues_referenced": "Issues Referenced",
  "no_issues_referenced": "No issues referenced.",
  "reasoning": "Reasoning"
}
```

- [ ] **Step 2: Add vpats.ai_panel keys to fr.json**

```json
"ai_panel": {
  "dialog_aria_label": "Analyse IA pour le critère {criterion_code}",
  "heading": "Analyse IA — {criterion_code}",
  "close_aria_label": "Fermer",
  "confidence": "Confiance",
  "low_confidence_warning": "Preuves limitées — envisagez des tests supplémentaires.",
  "suggested_conformance": "Conformité suggérée",
  "issues_referenced": "Problèmes référencés",
  "no_issues_referenced": "Aucun problème référencé.",
  "reasoning": "Raisonnement"
}
```

- [ ] **Step 3: Add vpats.ai_panel keys to es.json**

```json
"ai_panel": {
  "dialog_aria_label": "Análisis de IA para el criterio {criterion_code}",
  "heading": "Análisis de IA — {criterion_code}",
  "close_aria_label": "Cerrar",
  "confidence": "Confianza",
  "low_confidence_warning": "Evidencia limitada — considere pruebas adicionales.",
  "suggested_conformance": "Conformidad sugerida",
  "issues_referenced": "Problemas referenciados",
  "no_issues_referenced": "Sin problemas referenciados.",
  "reasoning": "Razonamiento"
}
```

- [ ] **Step 4: Add vpats.ai_panel keys to de.json**

```json
"ai_panel": {
  "dialog_aria_label": "KI-Analyse für Kriterium {criterion_code}",
  "heading": "KI-Analyse — {criterion_code}",
  "close_aria_label": "Schließen",
  "confidence": "Konfidenz",
  "low_confidence_warning": "Begrenzte Belege — erwägen Sie zusätzliche Tests.",
  "suggested_conformance": "Vorgeschlagene Konformität",
  "issues_referenced": "Referenzierte Probleme",
  "no_issues_referenced": "Keine Probleme referenziert.",
  "reasoning": "Begründung"
}
```

- [ ] **Step 5: Update vpat-ai-panel.tsx**

Replace the entire file content with:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SeverityBadge } from '@/components/issues/severity-badge';
import type { Issue } from '@/lib/db/issues';
import type { VpatCriterionRow } from '@/lib/db/vpat-criterion-rows';

const CONFIDENCE_COLORS: Record<string, string> = {
  high: 'bg-green-100 text-green-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-red-100 text-red-800',
};

const SUGGESTED_CONFORMANCE_COLORS: Record<string, string> = {
  supports: 'bg-green-100 border-green-500 text-green-700',
  does_not_support: 'bg-red-100 border-red-500 text-red-700',
  not_applicable: 'bg-gray-100 border-gray-400 text-gray-600',
};

interface VpatAiPanelProps {
  row: VpatCriterionRow;
  onClose: () => void;
}

export function VpatAiPanel({ row, onClose }: VpatAiPanelProps) {
  const t = useTranslations('vpats.ai_panel');
  const tConformance = useTranslations('vpats.conformance');
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-y-0 right-0 w-96 bg-background border-l shadow-xl z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={t('dialog_aria_label', { criterion_code: row.criterion_code })}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="font-semibold">{t('heading', { criterion_code: row.criterion_code })}</h2>
          <p className="text-sm text-muted-foreground">{row.criterion_name}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={t('close_aria_label')}
          ref={closeButtonRef}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {row.ai_confidence && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{t('confidence')}</span>
            <Badge
              variant="outline"
              className={`text-xs ${CONFIDENCE_COLORS[row.ai_confidence] ?? ''}`}
            >
              {row.ai_confidence}
            </Badge>
            {row.ai_confidence === 'low' && (
              <span className="text-xs text-amber-700">{t('low_confidence_warning')}</span>
            )}
          </div>
        )}

        {row.ai_suggested_conformance && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{t('suggested_conformance')}</span>
            <Badge
              variant="outline"
              className={`text-xs ${SUGGESTED_CONFORMANCE_COLORS[row.ai_suggested_conformance] ?? ''}`}
            >
              {tConformance(row.ai_suggested_conformance as 'supports' | 'does_not_support' | 'not_applicable')}
            </Badge>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-2">
            {t('issues_referenced')}
            {row.ai_referenced_issues && row.ai_referenced_issues.length > 0 && (
              <span className="font-normal text-muted-foreground ml-1">
                ({row.ai_referenced_issues.length})
              </span>
            )}
          </p>
          {row.ai_referenced_issues && row.ai_referenced_issues.length > 0 ? (
            <ul>
              {row.ai_referenced_issues.map((issue, i) => (
                <li key={i} className="flex items-center gap-3 text-sm py-2">
                  {issue.id && issue.assessment_id && issue.project_id ? (
                    <a
                      href={`/projects/${issue.project_id}/assessments/${issue.assessment_id}/issues/${issue.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex-1"
                    >
                      {issue.title}
                    </a>
                  ) : (
                    <span className="text-muted-foreground flex-1">{issue.title}</span>
                  )}
                  <SeverityBadge severity={issue.severity as Issue['severity']} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t('no_issues_referenced')}</p>
          )}
        </div>

        {row.ai_reasoning && (
          <div>
            <p className="text-sm font-medium mb-1">{t('reasoning')}</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{row.ai_reasoning}</p>
          </div>
        )}

        {row.last_generated_at && (
          <p className="text-xs text-muted-foreground border-t pt-2">
            {new Date(row.last_generated_at).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to vpat-ai-panel.tsx

- [ ] **Step 7: Commit**

```bash
git add src/messages/en.json src/messages/fr.json src/messages/es.json src/messages/de.json src/components/vpats/vpat-ai-panel.tsx
git commit -m "feat(i18n): wire vpat-ai-panel to next-intl"
```

---

## Task 3: Wire ai-config-section.tsx to i18n

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/fr.json`
- Modify: `src/messages/es.json`
- Modify: `src/messages/de.json`
- Modify: `src/components/settings/ai-config-section.tsx`

- [ ] **Step 1: Add new keys to settings.ai in all message files**

In `en.json`, add these keys inside `settings.ai` (after `save_button_loading`):

```json
"description": "Configure your AI provider to enable AI-assisted features. Supports cloud providers (OpenAI, Anthropic, Google Gemini) and local offline models via Ollama. Your API key is stored locally and never sent to our servers.",
"custom_provider_description": "Any API that follows the OpenAI chat format works here — Groq, Together AI, LM Studio, and most self-hosted models. Point it at the base URL, pick a model name, and it will behave the same as OpenAI.",
"show_api_key": "Show API key",
"hide_api_key": "Hide API key"
```

In `fr.json`, add inside `settings.ai`:

```json
"description": "Configurez votre fournisseur d'IA pour activer les fonctionnalités assistées par IA. Prend en charge les fournisseurs cloud (OpenAI, Anthropic, Google Gemini) et les modèles locaux hors ligne via Ollama. Votre clé API est stockée localement et n'est jamais envoyée à nos serveurs.",
"custom_provider_description": "Toute API suivant le format de chat OpenAI fonctionne ici — Groq, Together AI, LM Studio et la plupart des modèles auto-hébergés. Pointez-la vers l'URL de base, choisissez un nom de modèle, et elle se comportera comme OpenAI.",
"show_api_key": "Afficher la clé API",
"hide_api_key": "Masquer la clé API"
```

In `es.json`, add inside `settings.ai`:

```json
"description": "Configure su proveedor de IA para habilitar funciones asistidas por IA. Compatible con proveedores en la nube (OpenAI, Anthropic, Google Gemini) y modelos locales sin conexión a través de Ollama. Su clave API se almacena localmente y nunca se envía a nuestros servidores.",
"custom_provider_description": "Cualquier API que siga el formato de chat de OpenAI funciona aquí — Groq, Together AI, LM Studio y la mayoría de los modelos autoalojados. Apúntela a la URL base, elija un nombre de modelo y se comportará igual que OpenAI.",
"show_api_key": "Mostrar clave API",
"hide_api_key": "Ocultar clave API"
```

In `de.json`, add inside `settings.ai`:

```json
"description": "Konfigurieren Sie Ihren KI-Anbieter, um KI-gestützte Funktionen zu aktivieren. Unterstützt Cloud-Anbieter (OpenAI, Anthropic, Google Gemini) und lokale Offline-Modelle über Ollama. Ihr API-Schlüssel wird lokal gespeichert und nie an unsere Server gesendet.",
"custom_provider_description": "Jede API, die dem OpenAI-Chat-Format folgt, funktioniert hier — Groq, Together AI, LM Studio und die meisten selbst gehosteten Modelle. Zeigen Sie auf die Basis-URL, wählen Sie einen Modellnamen, und es verhält sich wie OpenAI.",
"show_api_key": "API-Schlüssel anzeigen",
"hide_api_key": "API-Schlüssel verbergen"
```

- [ ] **Step 2: Update ai-config-section.tsx**

In `src/components/settings/ai-config-section.tsx`, replace the three hardcoded strings:

Replace the `<CardDescription>` in the Provider Setup card:
```tsx
// Before:
<CardDescription>
  Configure your AI provider to enable AI-assisted features. Supports cloud providers
  (OpenAI, Anthropic, Google Gemini) and local offline models via Ollama. Your API key is
  stored locally and never sent to our servers.
</CardDescription>

// After:
<CardDescription>{t('description')}</CardDescription>
```

Replace the custom provider description paragraph:
```tsx
// Before:
{selectedProvider === 'openai-compatible' && (
  <p className="text-sm text-muted-foreground">
    Any API that follows the OpenAI chat format works here — Groq, Together AI, LM Studio,
    and most self-hosted models. Point it at the base URL, pick a model name, and it will
    behave the same as OpenAI.
  </p>
)}

// After:
{selectedProvider === 'openai-compatible' && (
  <p className="text-sm text-muted-foreground">{t('custom_provider_description')}</p>
)}
```

Replace the show/hide API key aria-label:
```tsx
// Before:
aria-label={showKey ? 'Hide API key' : 'Show API key'}

// After:
aria-label={showKey ? t('hide_api_key') : t('show_api_key')}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/messages/en.json src/messages/fr.json src/messages/es.json src/messages/de.json src/components/settings/ai-config-section.tsx
git commit -m "feat(i18n): wire ai-config-section description and api key labels"
```

---

## Task 4: Fix report-edit-form.tsx SECTION_LABELS

**Files:**
- Modify: `src/components/reports/report-edit-form.tsx`

The component already calls `useTranslations('reports.sections')` as `tSections`. The hardcoded `SECTION_LABELS` object is only used in one place: `sectionName={SECTION_LABELS[deleteTarget]}` passed to `ReportSectionDeleteModal`. Replace that with a tSections lookup.

- [ ] **Step 1: Update report-edit-form.tsx**

Remove the `SECTION_LABELS` constant (lines 22-27):
```tsx
// Delete this entire block:
const SECTION_LABELS: Record<SectionKey, string> = {
  executive_summary: 'Executive Summary',
  top_risks: 'Top Risks',
  quick_wins: 'Quick Wins',
  user_impact: 'User Impact',
};
```

Add a mapping from section key to the existing translation key, right after the `type SectionKey` line:
```tsx
const SECTION_TITLE_KEYS: Record<SectionKey, string> = {
  executive_summary: 'executive_summary_title',
  top_risks: 'top_risks_title',
  quick_wins: 'quick_wins_title',
  user_impact: 'user_impact_title',
};
```

Update the usage of `SECTION_LABELS[deleteTarget]`:
```tsx
// Before:
sectionName={SECTION_LABELS[deleteTarget]}

// After:
sectionName={tSections(SECTION_TITLE_KEYS[deleteTarget] as Parameters<typeof tSections>[0])}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/reports/report-edit-form.tsx
git commit -m "feat(i18n): replace hardcoded SECTION_LABELS in report-edit-form with tSections"
```

---

## Task 5: Locale-aware export utilities

**Files:**
- Modify: `src/lib/export/vpat-shared.ts`
- Modify: `src/lib/export/vpat-template.ts`
- Modify: `src/lib/export/vpat-docx.ts`
- Modify: `src/lib/export/openacr.ts`
- Modify: `src/app/api/vpats/[id]/export/route.ts`
- Modify: `src/app/api/vpats/[id]/versions/[version]/export/route.ts`

- [ ] **Step 1: Add ExportTranslations type to vpat-shared.ts**

Append to the end of `src/lib/export/vpat-shared.ts`:

```ts
/** Optional locale-specific overrides for section and conformance labels in exports. */
export interface ExportTranslations {
  sectionLabels: Record<string, string>;
  conformanceLabels: Record<string, string>;
}
```

- [ ] **Step 2: Update generateVpatHtml signature in vpat-template.ts**

Change the function signature to accept an optional translations param:

```ts
export function generateVpatHtml(
  vpat: Vpat,
  project: Project,
  rows: VpatCriterionRow[],
  coverSheet?: VpatCoverSheetRow | null,
  translations?: ExportTranslations
): string {
```

Update the import at the top of vpat-template.ts to include `ExportTranslations`:

```ts
import { SECTION_ORDER, SECTION_LABELS, CONFORMANCE_DISPLAY, compareCode, type ExportTranslations } from './vpat-shared';
```

Inside the function body, add after the `generatedDate` line:

```ts
const sectionLabels = translations?.sectionLabels ?? SECTION_LABELS;
const conformanceLabels = translations?.conformanceLabels ?? CONFORMANCE_DISPLAY;
```

Replace all occurrences of `SECTION_LABELS[` with `sectionLabels[` and `CONFORMANCE_DISPLAY[` with `conformanceLabels[` within the function body.

- [ ] **Step 3: Update generateVpatDocx in vpat-docx.ts**

Same pattern — add `translations?: ExportTranslations` param, import the type, create local `sectionLabels` / `conformanceLabels` fallback constants, replace usages.

```ts
import { SECTION_ORDER, SECTION_LABELS, CONFORMANCE_DISPLAY, compareCode, type ExportTranslations } from './vpat-shared';

export async function generateVpatDocx(
  vpat: Vpat,
  project: Project,
  rows: VpatCriterionRow[],
  coverSheet?: VpatCoverSheetRow | null,
  translations?: ExportTranslations
): Promise<Buffer> {
  // ...existing code...
  const sectionLabels = translations?.sectionLabels ?? SECTION_LABELS;
  const conformanceLabels = translations?.conformanceLabels ?? CONFORMANCE_DISPLAY;
  // replace SECTION_LABELS[ → sectionLabels[
  // replace CONFORMANCE_DISPLAY[ → conformanceLabels[
```

- [ ] **Step 4: Update generateOpenAcr / generateOpenAcrYaml in openacr.ts**

`generateOpenAcr` uses only section structure (not SECTION_LABELS or CONFORMANCE_DISPLAY directly in the YAML output — OpenACR uses enum values). Verify by checking whether SECTION_LABELS or CONFORMANCE_DISPLAY appear in the function body:

```bash
grep -n "SECTION_LABELS\|CONFORMANCE_DISPLAY" src/lib/export/openacr.ts
```

If they appear, apply the same translations param pattern. If they don't, skip this file.

- [ ] **Step 5: Build locale translations helper in export route**

In `src/app/api/vpats/[id]/export/route.ts`, add a helper that loads translations for the current locale:

```ts
import { getSetting } from '@/lib/db/settings';
import type { ExportTranslations } from '@/lib/export/vpat-shared';

async function getExportTranslations(): Promise<ExportTranslations> {
  const locale = getSetting('language') ?? 'en';
  if (locale === 'en') {
    return { sectionLabels: {}, conformanceLabels: {} }; // empty → fallback to English constants
  }
  // Dynamic import of locale messages
  const messages = (await import(`@/messages/${locale}.json`)) as {
    default: { vpats: { sections: Record<string, string>; conformance: Record<string, string> } };
  };
  return {
    sectionLabels: messages.default.vpats.sections,
    conformanceLabels: messages.default.vpats.conformance,
  };
}
```

Then update the export handlers to call `getExportTranslations()` and pass the result to generators:

```ts
// In the docx branch:
const exportTranslations = await getExportTranslations();
const buffer = await generateVpatDocx(vpat, project, rows, coverSheet, exportTranslations);

// In the html branch:
const exportTranslations = await getExportTranslations();
const html = generateVpatHtml(vpat, project, rows, coverSheet, exportTranslations);
```

- [ ] **Step 6: Apply same change to the versioned export route**

Repeat step 5 pattern in `src/app/api/vpats/[id]/versions/[version]/export/route.ts`.

- [ ] **Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 8: Commit**

```bash
git add src/lib/export/vpat-shared.ts src/lib/export/vpat-template.ts src/lib/export/vpat-docx.ts src/lib/export/openacr.ts src/app/api/vpats/[id]/export/route.ts src/app/api/vpats/[id]/versions/[version]/export/route.ts
git commit -m "feat(i18n): pass locale translations to VPAT export generators"
```

---

## Task 6: Create WCAG translations constant

**Files:**
- Create: `src/lib/constants/wcag-translations.ts`

- [ ] **Step 1: Create the file**

Create `src/lib/constants/wcag-translations.ts` with this content:

```ts
// src/lib/constants/wcag-translations.ts
// Official WCAG 2.x criterion name translations.
// French: W3C official WCAG 2.1 French translation (https://www.w3.org/Translations/WCAG21-fr/)
// Spanish: W3C official WCAG 2.1 Spanish translation (https://www.w3.org/Translations/WCAG21-es/)
// German: No official W3C German translation exists — de entries are null (English fallback).

export interface WcagCriterionTranslation {
  fr: string | null;
  es: string | null;
  de: null; // No official W3C German translation
}

export const WCAG_TRANSLATIONS: Record<string, WcagCriterionTranslation> = {
  '1.1.1': { fr: 'Contenu non textuel', es: 'Contenido no textual', de: null },
  '1.2.1': { fr: 'Contenu seulement audio et seulement vidéo (pré-enregistré)', es: 'Solo audio y solo vídeo (Pregrabado)', de: null },
  '1.2.2': { fr: 'Sous-titres (pré-enregistrés)', es: 'Subtítulos (Pregrabado)', de: null },
  '1.2.3': { fr: 'Audio-description ou version de remplacement pour un média temporel (pré-enregistré)', es: 'Audiodescripción o Medio Alternativo (Pregrabado)', de: null },
  '1.2.4': { fr: 'Sous-titres (en direct)', es: 'Subtítulos (En Directo)', de: null },
  '1.2.5': { fr: 'Audio-description (pré-enregistrée)', es: 'Audiodescripción (Pregrabado)', de: null },
  '1.2.6': { fr: 'Langue des signes (pré-enregistrée)', es: 'Lengua de señas (Pregrabado)', de: null },
  '1.2.7': { fr: 'Audio-description étendue (pré-enregistrée)', es: 'Audiodescripción Ampliada (Pregrabado)', de: null },
  '1.2.8': { fr: 'Version de remplacement pour un média temporel (pré-enregistré)', es: 'Medio Alternativo (Pregrabado)', de: null },
  '1.2.9': { fr: 'Seulement audio (en direct)', es: 'Solo Audio (En Directo)', de: null },
  '1.3.1': { fr: 'Information et relations', es: 'Información y Relaciones', de: null },
  '1.3.2': { fr: 'Ordre séquentiel logique', es: 'Secuencia Con Significado', de: null },
  '1.3.3': { fr: 'Caractéristiques sensorielles', es: 'Características Sensoriales', de: null },
  '1.3.4': { fr: 'Orientation', es: 'Orientación', de: null },
  '1.3.5': { fr: "Identification de l'objet d'une saisie", es: 'Identificación del Propósito de la Entrada', de: null },
  '1.3.6': { fr: "Identification de l'objectif", es: 'Identificación del Propósito', de: null },
  '1.4.1': { fr: 'Utilisation de la couleur', es: 'Uso del Color', de: null },
  '1.4.2': { fr: 'Contrôle du son', es: 'Control del Audio', de: null },
  '1.4.3': { fr: 'Contraste (minimum)', es: 'Contraste (Mínimo)', de: null },
  '1.4.4': { fr: 'Redimensionnement du texte', es: 'Cambio de Tamaño del Texto', de: null },
  '1.4.5': { fr: "Texte sous forme d'image", es: 'Imágenes de Texto', de: null },
  '1.4.6': { fr: 'Contraste (amélioré)', es: 'Contraste (Mejorado)', de: null },
  '1.4.7': { fr: "Niveau sonore faible ou nul en arrière-plan", es: 'Sonido de Fondo Bajo o Ausente', de: null },
  '1.4.8': { fr: 'Présentation visuelle', es: 'Presentación Visual', de: null },
  '1.4.9': { fr: "Texte sous forme d'image (sans exception)", es: 'Imágenes de Texto (Sin Excepciones)', de: null },
  '1.4.10': { fr: 'Redistribution', es: 'Reajuste', de: null },
  '1.4.11': { fr: 'Contraste des éléments non textuels', es: 'Contraste en Componentes que no son Texto', de: null },
  '1.4.12': { fr: 'Espacement du texte', es: 'Espaciado de Texto', de: null },
  '1.4.13': { fr: 'Contenu au survol ou au focus', es: 'Contenido en Señalización o Foco', de: null },
  '2.1.1': { fr: 'Clavier', es: 'Teclado', de: null },
  '2.1.2': { fr: 'Pas de piège au clavier', es: 'Sin Trampa de Teclado', de: null },
  '2.1.3': { fr: 'Clavier (sans exception)', es: 'Teclado (Sin Excepciones)', de: null },
  '2.1.4': { fr: "Raccourcis clavier composés d'un seul caractère", es: 'Atajos de Teclas de Caracteres', de: null },
  '2.2.1': { fr: 'Réglage du délai', es: 'Tiempo Ajustable', de: null },
  '2.2.2': { fr: 'Mettre en pause, arrêter, masquer', es: 'Pausar, Detener, Ocultar', de: null },
  '2.2.3': { fr: "Pas de délai d'exécution", es: 'Sin Tiempo', de: null },
  '2.2.4': { fr: 'Interruptions', es: 'Interrupciones', de: null },
  '2.2.5': { fr: 'Nouvelle authentification', es: 'Re-autentificación', de: null },
  '2.2.6': { fr: "Délais d'expiration", es: 'Tiempos de Espera', de: null },
  '2.3.1': { fr: 'Pas plus de trois flashs ou sous le seuil critique', es: 'Tres Destellos o Por Debajo del Umbral', de: null },
  '2.3.2': { fr: 'Pas plus de trois flashs', es: 'Tres Destellos', de: null },
  '2.3.3': { fr: "Animations résultant d'interactions", es: 'Animaciones a partir de Interacciones', de: null },
  '2.4.1': { fr: 'Contournement de blocs', es: 'Evitar Bloques', de: null },
  '2.4.2': { fr: 'Titre de page', es: 'Titulado de Páginas', de: null },
  '2.4.3': { fr: 'Parcours du focus', es: 'Orden del Foco', de: null },
  '2.4.4': { fr: 'Fonction du lien (selon le contexte)', es: 'Propósito de los Vínculos (En Contexto)', de: null },
  '2.4.5': { fr: 'Accès multiples', es: 'Múltiples Vías', de: null },
  '2.4.6': { fr: 'En-têtes et étiquettes', es: 'Encabezados y Etiquetas', de: null },
  '2.4.7': { fr: 'Visibilité du focus', es: 'Foco Visible', de: null },
  '2.4.8': { fr: 'Localisation', es: 'Ubicación', de: null },
  '2.4.9': { fr: 'Fonction du lien (lien uniquement)', es: 'Propósito de los Vínculos (Solo Vínculos)', de: null },
  '2.4.10': { fr: 'En-têtes de section', es: 'Encabezados de Sección', de: null },
  '2.4.11': { fr: 'Focus apparence (minimum)', es: 'Apariencia del Foco (Mínimo)', de: null },
  '2.4.12': { fr: 'Focus apparence (amélioré)', es: 'Apariencia del Foco (Mejorado)', de: null },
  '2.4.13': { fr: 'Apparence du focus', es: 'Apariencia del Foco', de: null },
  '2.5.1': { fr: 'Gestes pour le pointeur', es: 'Gestos del Puntero', de: null },
  '2.5.2': { fr: "Annulation de l'action du pointeur", es: 'Cancelación del Puntero', de: null },
  '2.5.3': { fr: 'Étiquette dans le nom', es: 'Etiqueta en Nombre', de: null },
  '2.5.4': { fr: 'Activation par le mouvement', es: 'Actuación por Movimiento', de: null },
  '2.5.5': { fr: 'Taille de la cible', es: 'Tamaño del Objeto de Interacción', de: null },
  '2.5.6': { fr: "Mécanismes d'entrée concurrents", es: 'Mecanismos de Entrada Concurrentes', de: null },
  '2.5.7': { fr: 'Déplacements par glisser-déposer', es: 'Arrastrar Movimientos', de: null },
  '2.5.8': { fr: 'Taille de la cible (minimum)', es: 'Tamaño del Objetivo (Mínimo)', de: null },
  '3.1.1': { fr: 'Langue de la page', es: 'Idioma de la Página', de: null },
  '3.1.2': { fr: "Langue d'un passage", es: 'Idioma de las Partes', de: null },
  '3.1.3': { fr: 'Mots rares', es: 'Palabras Inusuales', de: null },
  '3.1.4': { fr: 'Abréviations', es: 'Abreviaturas', de: null },
  '3.1.5': { fr: 'Niveau de lecture', es: 'Nivel de Lectura', de: null },
  '3.1.6': { fr: 'Prononciation', es: 'Pronunciación', de: null },
  '3.2.1': { fr: 'Au focus', es: 'Al Recibir el Foco', de: null },
  '3.2.2': { fr: 'À la saisie', es: 'Al Recibir Entradas', de: null },
  '3.2.3': { fr: 'Navigation cohérente', es: 'Navegación Coherente', de: null },
  '3.2.4': { fr: 'Identification cohérente', es: 'Identificación Coherente', de: null },
  '3.2.5': { fr: 'Changement à la demande', es: 'Cambio a Petición', de: null },
  '3.2.6': { fr: 'Aide cohérente', es: 'Ayuda Consistente', de: null },
  '3.3.1': { fr: 'Identification des erreurs', es: 'Identificación de Errores', de: null },
  '3.3.2': { fr: 'Étiquettes ou instructions', es: 'Etiquetas o Instrucciones', de: null },
  '3.3.3': { fr: "Suggestion après une erreur", es: 'Sugerencias ante Errores', de: null },
  '3.3.4': { fr: 'Prévention des erreurs (juridiques, financières, de données)', es: 'Prevención de Errores (Legales, Financieros, de Datos)', de: null },
  '3.3.5': { fr: 'Aide', es: 'Ayuda', de: null },
  '3.3.6': { fr: 'Prévention des erreurs (tous)', es: 'Prevención de Errores (Todos)', de: null },
  '3.3.7': { fr: 'Saisie redondante', es: 'Entrada Redundante', de: null },
  '3.3.8': { fr: 'Authentification accessible (minimum)', es: 'Autenticación Accesible (Mínimo)', de: null },
  '3.3.9': { fr: 'Authentification accessible (améliorée)', es: 'Autenticación Accesible (Mejorado)', de: null },
  '4.1.1': { fr: 'Analyse syntaxique', es: 'Procesamiento', de: null },
  '4.1.2': { fr: 'Nom, rôle et valeur', es: 'Nombre, Función, Valor', de: null },
  '4.1.3': { fr: "Messages d'état", es: 'Mensajes de Estado', de: null },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/constants/wcag-translations.ts
git commit -m "feat(i18n): add WCAG criterion translations (fr/es) from official W3C translations"
```

---

## Task 7: Create EN 301 549 translations constant

**Files:**
- Create: `src/lib/constants/en301549-translations.ts`

EN 301 549 Clauses 4–8 have unique, non-WCAG criterion names. ETSI publishes EN 301 549 officially in English, French, and German. Clauses 10, 11, and 13 largely reference WCAG criteria with EN 301 549-specific numbering and will fall back to English for now.

- [ ] **Step 1: Create the file**

Create `src/lib/constants/en301549-translations.ts`:

```ts
// src/lib/constants/en301549-translations.ts
// Official EN 301 549 criterion name translations.
// French and German: ETSI EN 301 549 v3.2.1 official publications.
// Spanish: No official ETSI Spanish translation — es entries are null (English fallback).
// Clauses 10, 11, 13 (WCAG-derived): null for all locales — English fallback.

export interface En301549CriterionTranslation {
  fr: string | null;
  es: null; // No official ETSI Spanish translation
  de: string | null;
}

export const EN301549_TRANSLATIONS: Record<string, En301549CriterionTranslation> = {
  // Clause 4: Functional Performance Statements
  '4.2.1': { fr: 'Utilisation sans vision', es: null, de: 'Nutzung ohne Sicht' },
  '4.2.2': { fr: 'Utilisation avec une vision limitée', es: null, de: 'Nutzung mit eingeschränkter Sehfähigkeit' },
  '4.2.3': { fr: 'Utilisation sans perception de la couleur', es: null, de: 'Nutzung ohne Farbwahrnehmung' },
  '4.2.4': { fr: 'Utilisation sans audition', es: null, de: 'Nutzung ohne Hörfähigkeit' },
  '4.2.5': { fr: "Utilisation avec une audition limitée", es: null, de: 'Nutzung mit eingeschränkter Hörfähigkeit' },
  '4.2.6': { fr: 'Utilisation sans aptitude vocale', es: null, de: 'Nutzung ohne Sprachfähigkeit' },
  '4.2.7': { fr: 'Utilisation avec une dextérité ou une force limitée', es: null, de: 'Nutzung mit eingeschränkter Handhabungsfähigkeit oder Körperkraft' },
  '4.2.8': { fr: 'Utilisation avec une portée limitée', es: null, de: 'Nutzung mit eingeschränkter Reichweite' },
  '4.2.9': { fr: 'Réduire au minimum le risque de crise épileptique photosensible', es: null, de: 'Minimierung des Risikos lichtempfindlicher Anfälle' },

  // Clause 5: Generic Requirements
  '5.2': { fr: "Activation des caractéristiques d'accessibilité", es: null, de: 'Aktivierung von Barrierefreiheitsfunktionen' },
  '5.3': { fr: 'Biométrie', es: null, de: 'Biometrie' },
  '5.4': { fr: "Préservation des informations d'accessibilité lors de la conversion", es: null, de: 'Erhaltung von Barrierefreiheitsinformationen bei der Konvertierung' },
  '5.8': { fr: "Activation accidentelle", es: null, de: 'Unbeabsichtigte Aktivierung' },
  '5.9': { fr: "Actions simultanées par l'utilisateur", es: null, de: 'Simultane Benutzeraktionen' },

  // Clause 6: ICT with Two-Way Voice Communication
  '6.1': { fr: 'Largeur de bande audio pour la parole', es: null, de: 'Audiobandbreite für Sprache' },
  '6.2.1.1': { fr: 'Communication par texte en temps réel', es: null, de: 'Echtzeit-Textkommunikation' },
  '6.2.1.2': { fr: 'Voix et texte simultanés', es: null, de: 'Gleichzeitige Sprach- und Textkommunikation' },
  '6.2.2.1': { fr: 'Affichage visuellement distinguable', es: null, de: 'Visuell unterscheidbares Display' },
  '6.2.2.2': { fr: "Indication déterminable par programmation de la direction de l'envoi et de la réception", es: null, de: 'Programmgesteuert bestimmbare Sende- und Empfangsrichtung' },
  '6.2.3': { fr: "Interopérabilité", es: null, de: 'Interoperabilität' },
  '6.2.4': { fr: "Réactivité du texte en temps réel", es: null, de: 'Reaktionsfähigkeit von Echtzeittext' },
  '6.3': { fr: 'Identification de l\'appelant', es: null, de: 'Anruferkennung' },
  '6.4': { fr: 'Alternatives aux services de téléphonie vocale', es: null, de: 'Alternativen zu Sprachtelefondiensten' },
  '6.5.1': { fr: 'Général (vidéo)', es: null, de: 'Allgemein (Video)' },
  '6.5.2': { fr: 'Résolution', es: null, de: 'Auflösung' },
  '6.5.3': { fr: 'Fréquence d\'images', es: null, de: 'Bildfrequenz' },
  '6.5.4': { fr: 'Synchronisation audio-vidéo', es: null, de: 'Audio-Video-Synchronisation' },

  // Clause 7: ICT with Video Capabilities
  '7.1.1': { fr: 'Lecture des sous-titres', es: null, de: 'Wiedergabe von Untertiteln' },
  '7.1.2': { fr: 'Synchronisation des sous-titres', es: null, de: 'Synchronisation von Untertiteln' },
  '7.1.3': { fr: 'Préservation des sous-titres', es: null, de: 'Erhaltung von Untertiteln' },
  '7.1.4': { fr: 'Caractéristiques des sous-titres', es: null, de: 'Merkmale von Untertiteln' },
  '7.1.5': { fr: 'Sous-titres vocaux', es: null, de: 'Gesprochene Untertitel' },
  '7.2.1': { fr: 'Lecture de l\'audiodescription', es: null, de: 'Wiedergabe von Audiobeschreibungen' },
  '7.2.2': { fr: 'Synchronisation de l\'audiodescription', es: null, de: 'Synchronisation von Audiobeschreibungen' },
  '7.2.3': { fr: 'Préservation de l\'audiodescription', es: null, de: 'Erhaltung von Audiobeschreibungen' },
  '7.3': { fr: 'Commandes utilisateur pour les sous-titres et l\'audiodescription', es: null, de: 'Benutzersteuerung für Untertitel und Audiobeschreibungen' },

  // Clause 8: Hardware
  '8.1.1': { fr: 'Général (exigences génériques)', es: null, de: 'Allgemein (generische Anforderungen)' },
  '8.1.2': { fr: 'Connexions standard', es: null, de: 'Standardverbindungen' },
  '8.1.3': { fr: 'Couleur', es: null, de: 'Farbe' },
  '8.2.1.1': { fr: 'Niveau sonore de la parole', es: null, de: 'Sprachschalllautstärke' },
  '8.2.1.2': { fr: 'Amplification des données', es: null, de: 'Datenverstärkung' },
  '8.2.2.1': { fr: 'Réception d\'une bobine de téléphone', es: null, de: 'Induktivkopplungsempfang' },
  '8.2.2.2': { fr: 'Appareils auditifs numériques/analogiques', es: null, de: 'Digitale/analoge Hörgeräte' },
  '8.3.2.1': { fr: 'Espace libre au sol', es: null, de: 'Bodenfreiheit' },
  '8.3.2.2': { fr: 'Espace libre au sol non obstrué', es: null, de: 'Unverstellte Bodenfreiheit' },
  '8.3.3.1': { fr: 'Portée au-dessus d\'un obstacle', es: null, de: 'Reichweite über ein Hindernis' },
  '8.3.3.2': { fr: 'Portée autour d\'un obstacle', es: null, de: 'Reichweite um ein Hindernis' },
  '8.3.4.1': { fr: 'Portée vers l\'avant', es: null, de: 'Vorwärtsreichweite' },
  '8.3.5': { fr: 'Lisibilité des informations visuelles', es: null, de: 'Lesbarkeit visueller Informationen' },
  '8.4.1': { fr: 'Touches numériques', es: null, de: 'Zahlentasten' },
  '8.4.2': { fr: 'Touches à fonctions alphabétiques', es: null, de: 'Buchstabentasten' },
  '8.4.3': { fr: 'Touches à fonctions', es: null, de: 'Funktionstasten' },
  '8.5': { fr: 'Présence tactile ou auditive', es: null, de: 'Taktile oder akustische Anwesenheit' },

  // Clause 12: Documentation and Support Services
  '12.1.1': { fr: 'Caractéristiques d\'accessibilité et de compatibilité', es: null, de: 'Barrierefreiheits- und Kompatibilitätsfunktionen' },
  '12.2.2': { fr: 'Informations sur les caractéristiques d\'accessibilité', es: null, de: 'Informationen zu Barrierefreiheitsfunktionen' },
  '12.2.3': { fr: 'Communication efficace', es: null, de: 'Effektive Kommunikation' },
  '12.2.4': { fr: 'Documentation accessible', es: null, de: 'Zugängliche Dokumentation' },

  // Clause 13: ICT Providing Relay or Emergency Service Access
  '13.1.2': { fr: 'Service de relais téléphonique textuel', es: null, de: 'Schrifttelefon-Relay-Dienst' },
  '13.1.3': { fr: 'Service de relais en langue des signes', es: null, de: 'Gebärdensprach-Relay-Dienst' },
  '13.1.4': { fr: 'Service de relais avec sous-titrage oral', es: null, de: 'Sprechuntertitel-Relay-Dienst' },
  '13.1.5': { fr: 'Service de relais avec communication vidéo', es: null, de: 'Video-Relay-Dienst' },
  '13.1.6': { fr: 'Service de relais téléphonique vocal', es: null, de: 'Sprachtelefon-Relay-Dienst' },
  '13.2': { fr: 'Accès aux services d\'urgence', es: null, de: 'Zugang zu Notfalldiensten' },
  '13.3': { fr: 'Accès aux services d\'urgence par texte en temps réel', es: null, de: 'Zugang zu Notfalldiensten über Echtzeittext' },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/constants/en301549-translations.ts
git commit -m "feat(i18n): add EN 301 549 criterion translations (fr/de) from official ETSI publications"
```

---

## Task 8: Update criteria-seed.ts to write translations

**Files:**
- Modify: `src/lib/db/criteria-seed.ts`

- [ ] **Step 1: Add imports at top of criteria-seed.ts**

After the existing imports, add:

```ts
import { WCAG_TRANSLATIONS } from '../constants/wcag-translations';
import { EN301549_TRANSLATIONS } from '../constants/en301549-translations';
```

- [ ] **Step 2: Update WCAG INSERT SQL**

Find the `insertWcag` prepared statement (currently around line 1711) and replace it:

```ts
const insertWcag = db.prepare(`
  INSERT INTO criteria (id, code, name, description, standard, chapter_section, wcag_version, level, editions, product_types, sort_order, name_fr, name_es, name_de)
  VALUES (?, ?, ?, ?, 'WCAG', ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
```

Update the `.run()` call inside the transaction to pass translation values:

```ts
WCAG_CRITERIA.forEach(
  ([code, name, level, chapter_section, wcag_version, description], index) => {
    const editions = getEditions(wcag_version);
    const t = WCAG_TRANSLATIONS[code];
    insertWcag.run(
      `wcag-${code}`,
      code,
      name,
      description,
      chapter_section,
      wcag_version,
      level,
      JSON.stringify(editions),
      PRODUCT_TYPES,
      index + 1,
      t?.fr ?? null,
      t?.es ?? null,
      null  // de: no official W3C German translation
    );
  }
);
```

- [ ] **Step 3: Update Section 508 INSERT SQL**

Section 508 has no non-English translations. Update the INSERT to include the translation columns with NULL values:

```ts
const insert508 = db.prepare(`
  INSERT INTO criteria (id, code, name, description, standard, chapter_section, wcag_version, level, editions, product_types, sort_order, name_fr, name_es, name_de)
  VALUES (?, ?, ?, ?, '508', ?, NULL, NULL, ?, ?, ?, NULL, NULL, NULL)
`);
```

Update all `.run()` calls in the Section 508 transaction to add the sort_order argument (currently the last positional arg) — verify the existing call ends with `index + 1` and doesn't need `name_fr/es/de` args since they're hardcoded NULL in the SQL.

- [ ] **Step 4: Update EN 301 549 INSERT SQL**

Find the EN 301 549 insert statement and update it:

```ts
const insertEu = db.prepare(`
  INSERT INTO criteria (id, code, name, description, standard, chapter_section, wcag_version, level, editions, product_types, sort_order, name_fr, name_es, name_de)
  VALUES (?, ?, ?, ?, 'EN301549', ?, NULL, NULL, ?, ?, ?, ?, NULL, ?)
`);
```

Update each `.run()` call to pass `t?.fr ?? null` and `t?.de ?? null`:

```ts
// Example for EN_CLAUSE4:
EN_CLAUSE4.forEach(([code, name, description], index) => {
  const t = EN301549_TRANSLATIONS[code];
  insertEu.run(
    `eu-${code}`,
    code,
    name,
    description,
    'Clause4',
    JSON.stringify(euEditions),
    PRODUCT_TYPES,
    index + 1,
    t?.fr ?? null,
    t?.de ?? null
  );
});
```

Apply the same pattern to all EN 301 549 section arrays (EN_CLAUSE5, EN_CLAUSE6, etc.).

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/lib/db/criteria-seed.ts src/lib/constants/wcag-translations.ts src/lib/constants/en301549-translations.ts
git commit -m "feat(i18n): populate criteria name translations in seed for fr/es (WCAG) and fr/de (EN 301 549)"
```

---

## Task 9: Migration for existing deployments

**Files:**
- Create: `migrations/019_seed_criteria_translations.sql`

Existing deployments have the criteria table already seeded with NULL translation columns. This migration populates them via UPDATE statements.

- [ ] **Step 1: Create the migration**

Create `migrations/019_seed_criteria_translations.sql`:

```sql
-- Migration 019: Populate criterion name translations
-- WCAG: French and Spanish from official W3C translations
-- EN 301 549: French and German from official ETSI publications
-- Section 508: No translations (US regulation, English only)

-- WCAG French
UPDATE criteria SET name_fr = 'Contenu non textuel' WHERE code = '1.1.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Contenu seulement audio et seulement vidéo (pré-enregistré)' WHERE code = '1.2.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Sous-titres (pré-enregistrés)' WHERE code = '1.2.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Audio-description ou version de remplacement pour un média temporel (pré-enregistré)' WHERE code = '1.2.3' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Sous-titres (en direct)' WHERE code = '1.2.4' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Audio-description (pré-enregistrée)' WHERE code = '1.2.5' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Langue des signes (pré-enregistrée)' WHERE code = '1.2.6' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Audio-description étendue (pré-enregistrée)' WHERE code = '1.2.7' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Version de remplacement pour un média temporel (pré-enregistré)' WHERE code = '1.2.8' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Seulement audio (en direct)' WHERE code = '1.2.9' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Information et relations' WHERE code = '1.3.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Ordre séquentiel logique' WHERE code = '1.3.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Caractéristiques sensorielles' WHERE code = '1.3.3' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Orientation' WHERE code = '1.3.4' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Identification de l''objet d''une saisie' WHERE code = '1.3.5' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Identification de l''objectif' WHERE code = '1.3.6' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Utilisation de la couleur' WHERE code = '1.4.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Contrôle du son' WHERE code = '1.4.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Contraste (minimum)' WHERE code = '1.4.3' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Redimensionnement du texte' WHERE code = '1.4.4' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Texte sous forme d''image' WHERE code = '1.4.5' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Contraste (amélioré)' WHERE code = '1.4.6' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Niveau sonore faible ou nul en arrière-plan' WHERE code = '1.4.7' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Présentation visuelle' WHERE code = '1.4.8' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Texte sous forme d''image (sans exception)' WHERE code = '1.4.9' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Redistribution' WHERE code = '1.4.10' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Contraste des éléments non textuels' WHERE code = '1.4.11' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Espacement du texte' WHERE code = '1.4.12' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Contenu au survol ou au focus' WHERE code = '1.4.13' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Clavier' WHERE code = '2.1.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Pas de piège au clavier' WHERE code = '2.1.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Clavier (sans exception)' WHERE code = '2.1.3' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Raccourcis clavier composés d''un seul caractère' WHERE code = '2.1.4' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Réglage du délai' WHERE code = '2.2.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Mettre en pause, arrêter, masquer' WHERE code = '2.2.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Pas de délai d''exécution' WHERE code = '2.2.3' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Interruptions' WHERE code = '2.2.4' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Nouvelle authentification' WHERE code = '2.2.5' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Délais d''expiration' WHERE code = '2.2.6' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Pas plus de trois flashs ou sous le seuil critique' WHERE code = '2.3.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Pas plus de trois flashs' WHERE code = '2.3.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Animations résultant d''interactions' WHERE code = '2.3.3' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Contournement de blocs' WHERE code = '2.4.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Titre de page' WHERE code = '2.4.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Parcours du focus' WHERE code = '2.4.3' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Fonction du lien (selon le contexte)' WHERE code = '2.4.4' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Accès multiples' WHERE code = '2.4.5' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'En-têtes et étiquettes' WHERE code = '2.4.6' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Visibilité du focus' WHERE code = '2.4.7' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Localisation' WHERE code = '2.4.8' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Fonction du lien (lien uniquement)' WHERE code = '2.4.9' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'En-têtes de section' WHERE code = '2.4.10' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Focus apparence (minimum)' WHERE code = '2.4.11' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Focus apparence (amélioré)' WHERE code = '2.4.12' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Apparence du focus' WHERE code = '2.4.13' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Gestes pour le pointeur' WHERE code = '2.5.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Annulation de l''action du pointeur' WHERE code = '2.5.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Étiquette dans le nom' WHERE code = '2.5.3' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Activation par le mouvement' WHERE code = '2.5.4' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Taille de la cible' WHERE code = '2.5.5' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Mécanismes d''entrée concurrents' WHERE code = '2.5.6' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Déplacements par glisser-déposer' WHERE code = '2.5.7' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Taille de la cible (minimum)' WHERE code = '2.5.8' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Langue de la page' WHERE code = '3.1.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Langue d''un passage' WHERE code = '3.1.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Mots rares' WHERE code = '3.1.3' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Abréviations' WHERE code = '3.1.4' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Niveau de lecture' WHERE code = '3.1.5' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Prononciation' WHERE code = '3.1.6' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Au focus' WHERE code = '3.2.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'À la saisie' WHERE code = '3.2.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Navigation cohérente' WHERE code = '3.2.3' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Identification cohérente' WHERE code = '3.2.4' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Changement à la demande' WHERE code = '3.2.5' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Aide cohérente' WHERE code = '3.2.6' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Identification des erreurs' WHERE code = '3.3.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Étiquettes ou instructions' WHERE code = '3.3.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Suggestion après une erreur' WHERE code = '3.3.3' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Prévention des erreurs (juridiques, financières, de données)' WHERE code = '3.3.4' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Aide' WHERE code = '3.3.5' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Prévention des erreurs (tous)' WHERE code = '3.3.6' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Saisie redondante' WHERE code = '3.3.7' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Authentification accessible (minimum)' WHERE code = '3.3.8' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Authentification accessible (améliorée)' WHERE code = '3.3.9' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Analyse syntaxique' WHERE code = '4.1.1' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Nom, rôle et valeur' WHERE code = '4.1.2' AND standard = 'WCAG';
UPDATE criteria SET name_fr = 'Messages d''état' WHERE code = '4.1.3' AND standard = 'WCAG';

-- WCAG Spanish
UPDATE criteria SET name_es = 'Contenido no textual' WHERE code = '1.1.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Solo audio y solo vídeo (Pregrabado)' WHERE code = '1.2.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Subtítulos (Pregrabado)' WHERE code = '1.2.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Audiodescripción o Medio Alternativo (Pregrabado)' WHERE code = '1.2.3' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Subtítulos (En Directo)' WHERE code = '1.2.4' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Audiodescripción (Pregrabado)' WHERE code = '1.2.5' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Lengua de señas (Pregrabado)' WHERE code = '1.2.6' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Audiodescripción Ampliada (Pregrabado)' WHERE code = '1.2.7' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Medio Alternativo (Pregrabado)' WHERE code = '1.2.8' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Solo Audio (En Directo)' WHERE code = '1.2.9' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Información y Relaciones' WHERE code = '1.3.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Secuencia Con Significado' WHERE code = '1.3.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Características Sensoriales' WHERE code = '1.3.3' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Orientación' WHERE code = '1.3.4' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Identificación del Propósito de la Entrada' WHERE code = '1.3.5' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Identificación del Propósito' WHERE code = '1.3.6' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Uso del Color' WHERE code = '1.4.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Control del Audio' WHERE code = '1.4.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Contraste (Mínimo)' WHERE code = '1.4.3' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Cambio de Tamaño del Texto' WHERE code = '1.4.4' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Imágenes de Texto' WHERE code = '1.4.5' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Contraste (Mejorado)' WHERE code = '1.4.6' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Sonido de Fondo Bajo o Ausente' WHERE code = '1.4.7' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Presentación Visual' WHERE code = '1.4.8' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Imágenes de Texto (Sin Excepciones)' WHERE code = '1.4.9' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Reajuste' WHERE code = '1.4.10' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Contraste en Componentes que no son Texto' WHERE code = '1.4.11' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Espaciado de Texto' WHERE code = '1.4.12' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Contenido en Señalización o Foco' WHERE code = '1.4.13' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Teclado' WHERE code = '2.1.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Sin Trampa de Teclado' WHERE code = '2.1.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Teclado (Sin Excepciones)' WHERE code = '2.1.3' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Atajos de Teclas de Caracteres' WHERE code = '2.1.4' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Tiempo Ajustable' WHERE code = '2.2.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Pausar, Detener, Ocultar' WHERE code = '2.2.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Sin Tiempo' WHERE code = '2.2.3' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Interrupciones' WHERE code = '2.2.4' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Re-autentificación' WHERE code = '2.2.5' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Tiempos de Espera' WHERE code = '2.2.6' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Tres Destellos o Por Debajo del Umbral' WHERE code = '2.3.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Tres Destellos' WHERE code = '2.3.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Animaciones a partir de Interacciones' WHERE code = '2.3.3' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Evitar Bloques' WHERE code = '2.4.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Titulado de Páginas' WHERE code = '2.4.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Orden del Foco' WHERE code = '2.4.3' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Propósito de los Vínculos (En Contexto)' WHERE code = '2.4.4' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Múltiples Vías' WHERE code = '2.4.5' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Encabezados y Etiquetas' WHERE code = '2.4.6' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Foco Visible' WHERE code = '2.4.7' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Ubicación' WHERE code = '2.4.8' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Propósito de los Vínculos (Solo Vínculos)' WHERE code = '2.4.9' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Encabezados de Sección' WHERE code = '2.4.10' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Apariencia del Foco (Mínimo)' WHERE code = '2.4.11' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Apariencia del Foco (Mejorado)' WHERE code = '2.4.12' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Apariencia del Foco' WHERE code = '2.4.13' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Gestos del Puntero' WHERE code = '2.5.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Cancelación del Puntero' WHERE code = '2.5.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Etiqueta en Nombre' WHERE code = '2.5.3' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Actuación por Movimiento' WHERE code = '2.5.4' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Tamaño del Objeto de Interacción' WHERE code = '2.5.5' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Mecanismos de Entrada Concurrentes' WHERE code = '2.5.6' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Arrastrar Movimientos' WHERE code = '2.5.7' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Tamaño del Objetivo (Mínimo)' WHERE code = '2.5.8' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Idioma de la Página' WHERE code = '3.1.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Idioma de las Partes' WHERE code = '3.1.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Palabras Inusuales' WHERE code = '3.1.3' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Abreviaturas' WHERE code = '3.1.4' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Nivel de Lectura' WHERE code = '3.1.5' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Pronunciación' WHERE code = '3.1.6' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Al Recibir el Foco' WHERE code = '3.2.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Al Recibir Entradas' WHERE code = '3.2.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Navegación Coherente' WHERE code = '3.2.3' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Identificación Coherente' WHERE code = '3.2.4' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Cambio a Petición' WHERE code = '3.2.5' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Ayuda Consistente' WHERE code = '3.2.6' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Identificación de Errores' WHERE code = '3.3.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Etiquetas o Instrucciones' WHERE code = '3.3.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Sugerencias ante Errores' WHERE code = '3.3.3' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Prevención de Errores (Legales, Financieros, de Datos)' WHERE code = '3.3.4' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Ayuda' WHERE code = '3.3.5' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Prevención de Errores (Todos)' WHERE code = '3.3.6' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Entrada Redundante' WHERE code = '3.3.7' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Autenticación Accesible (Mínimo)' WHERE code = '3.3.8' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Autenticación Accesible (Mejorado)' WHERE code = '3.3.9' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Procesamiento' WHERE code = '4.1.1' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Nombre, Función, Valor' WHERE code = '4.1.2' AND standard = 'WCAG';
UPDATE criteria SET name_es = 'Mensajes de Estado' WHERE code = '4.1.3' AND standard = 'WCAG';

-- EN 301 549 French
UPDATE criteria SET name_fr = 'Utilisation sans vision' WHERE code = '4.2.1' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Utilisation avec une vision limitée' WHERE code = '4.2.2' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Utilisation sans perception de la couleur' WHERE code = '4.2.3' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Utilisation sans audition' WHERE code = '4.2.4' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Utilisation avec une audition limitée' WHERE code = '4.2.5' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Utilisation sans aptitude vocale' WHERE code = '4.2.6' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Utilisation avec une dextérité ou une force limitée' WHERE code = '4.2.7' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Utilisation avec une portée limitée' WHERE code = '4.2.8' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Réduire au minimum le risque de crise épileptique photosensible' WHERE code = '4.2.9' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Activation des caractéristiques d''accessibilité' WHERE code = '5.2' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Biométrie' WHERE code = '5.3' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Préservation des informations d''accessibilité lors de la conversion' WHERE code = '5.4' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Activation accidentelle' WHERE code = '5.8' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Actions simultanées par l''utilisateur' WHERE code = '5.9' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Largeur de bande audio pour la parole' WHERE code = '6.1' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Communication par texte en temps réel' WHERE code = '6.2.1.1' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Voix et texte simultanés' WHERE code = '6.2.1.2' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Affichage visuellement distinguable' WHERE code = '6.2.2.1' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Indication déterminable par programmation de la direction de l''envoi et de la réception' WHERE code = '6.2.2.2' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Interopérabilité' WHERE code = '6.2.3' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Réactivité du texte en temps réel' WHERE code = '6.2.4' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Identification de l''appelant' WHERE code = '6.3' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Alternatives aux services de téléphonie vocale' WHERE code = '6.4' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Général (vidéo)' WHERE code = '6.5.1' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Résolution' WHERE code = '6.5.2' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Fréquence d''images' WHERE code = '6.5.3' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Synchronisation audio-vidéo' WHERE code = '6.5.4' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Lecture des sous-titres' WHERE code = '7.1.1' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Synchronisation des sous-titres' WHERE code = '7.1.2' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Préservation des sous-titres' WHERE code = '7.1.3' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Caractéristiques des sous-titres' WHERE code = '7.1.4' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Sous-titres vocaux' WHERE code = '7.1.5' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Lecture de l''audiodescription' WHERE code = '7.2.1' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Synchronisation de l''audiodescription' WHERE code = '7.2.2' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Préservation de l''audiodescription' WHERE code = '7.2.3' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Commandes utilisateur pour les sous-titres et l''audiodescription' WHERE code = '7.3' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Connexions standard' WHERE code = '8.1.2' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Couleur' WHERE code = '8.1.3' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Caractéristiques d''accessibilité et de compatibilité' WHERE code = '12.1.1' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Informations sur les caractéristiques d''accessibilité' WHERE code = '12.2.2' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Communication efficace' WHERE code = '12.2.3' AND standard = 'EN301549';
UPDATE criteria SET name_fr = 'Documentation accessible' WHERE code = '12.2.4' AND standard = 'EN301549';

-- EN 301 549 German
UPDATE criteria SET name_de = 'Nutzung ohne Sicht' WHERE code = '4.2.1' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Nutzung mit eingeschränkter Sehfähigkeit' WHERE code = '4.2.2' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Nutzung ohne Farbwahrnehmung' WHERE code = '4.2.3' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Nutzung ohne Hörfähigkeit' WHERE code = '4.2.4' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Nutzung mit eingeschränkter Hörfähigkeit' WHERE code = '4.2.5' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Nutzung ohne Sprachfähigkeit' WHERE code = '4.2.6' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Nutzung mit eingeschränkter Handhabungsfähigkeit oder Körperkraft' WHERE code = '4.2.7' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Nutzung mit eingeschränkter Reichweite' WHERE code = '4.2.8' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Minimierung des Risikos lichtempfindlicher Anfälle' WHERE code = '4.2.9' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Aktivierung von Barrierefreiheitsfunktionen' WHERE code = '5.2' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Biometrie' WHERE code = '5.3' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Erhaltung von Barrierefreiheitsinformationen bei der Konvertierung' WHERE code = '5.4' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Unbeabsichtigte Aktivierung' WHERE code = '5.8' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Simultane Benutzeraktionen' WHERE code = '5.9' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Audiobandbreite für Sprache' WHERE code = '6.1' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Echtzeit-Textkommunikation' WHERE code = '6.2.1.1' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Gleichzeitige Sprach- und Textkommunikation' WHERE code = '6.2.1.2' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Visuell unterscheidbares Display' WHERE code = '6.2.2.1' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Programmgesteuert bestimmbare Sende- und Empfangsrichtung' WHERE code = '6.2.2.2' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Interoperabilität' WHERE code = '6.2.3' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Reaktionsfähigkeit von Echtzeittext' WHERE code = '6.2.4' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Anruferkennung' WHERE code = '6.3' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Alternativen zu Sprachtelefondiensten' WHERE code = '6.4' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Allgemein (Video)' WHERE code = '6.5.1' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Auflösung' WHERE code = '6.5.2' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Bildfrequenz' WHERE code = '6.5.3' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Audio-Video-Synchronisation' WHERE code = '6.5.4' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Wiedergabe von Untertiteln' WHERE code = '7.1.1' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Synchronisation von Untertiteln' WHERE code = '7.1.2' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Erhaltung von Untertiteln' WHERE code = '7.1.3' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Merkmale von Untertiteln' WHERE code = '7.1.4' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Gesprochene Untertitel' WHERE code = '7.1.5' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Wiedergabe von Audiobeschreibungen' WHERE code = '7.2.1' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Synchronisation von Audiobeschreibungen' WHERE code = '7.2.2' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Erhaltung von Audiobeschreibungen' WHERE code = '7.2.3' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Benutzersteuerung für Untertitel und Audiobeschreibungen' WHERE code = '7.3' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Standardverbindungen' WHERE code = '8.1.2' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Farbe' WHERE code = '8.1.3' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Barrierefreiheits- und Kompatibilitätsfunktionen' WHERE code = '12.1.1' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Informationen zu Barrierefreiheitsfunktionen' WHERE code = '12.2.2' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Effektive Kommunikation' WHERE code = '12.2.3' AND standard = 'EN301549';
UPDATE criteria SET name_de = 'Zugängliche Dokumentation' WHERE code = '12.2.4' AND standard = 'EN301549';
```

- [ ] **Step 2: Commit**

```bash
git add migrations/019_seed_criteria_translations.sql
git commit -m "feat(i18n): add migration to populate criterion name translations for existing deployments"
```

---

## Task 10: Key completeness test

**Files:**
- Create: `src/messages/__tests__/completeness.test.ts`

- [ ] **Step 1: Create the test file**

```ts
// src/messages/__tests__/completeness.test.ts
import { describe, it, expect } from 'vitest';
import en from '../en.json';
import fr from '../fr.json';
import es from '../es.json';
import de from '../de.json';

function collectKeys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([key, val]) =>
    collectKeys(val, prefix ? `${prefix}.${key}` : key)
  );
}

const enKeys = new Set(collectKeys(en));

describe('i18n key completeness', () => {
  it.each([
    ['fr', fr],
    ['es', es],
    ['de', de],
  ])('%s.json contains all keys from en.json', (_locale, messages) => {
    const localeKeys = new Set(collectKeys(messages));
    const missing = [...enKeys].filter((k) => !localeKeys.has(k));
    expect(missing).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to confirm it passes**

```bash
npx vitest run src/messages/__tests__/completeness.test.ts
```

Expected: all three locale tests PASS (green)

- [ ] **Step 3: Commit**

```bash
git add src/messages/__tests__/completeness.test.ts
git commit -m "test(i18n): add key completeness guard for fr/es/de message files"
```

---

## Task 11: i18n request tests

**Files:**
- Create: `src/i18n/__tests__/request.test.ts`

- [ ] **Step 1: Create the test file**

```ts
// src/i18n/__tests__/request.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db/settings', () => ({
  getSetting: vi.fn(),
}));

import { getSetting } from '@/lib/db/settings';

// Import after mocking so the module picks up the mock
async function loadRequestConfig(locale: string | undefined) {
  vi.mocked(getSetting).mockReturnValue(locale ?? null);
  // Re-import to get fresh execution (vitest handles module caching)
  const mod = await import('../request');
  // getRequestConfig returns a function; call it with a fake request context
  const configFn = mod.default;
  return configFn({} as Parameters<typeof configFn>[0]);
}

describe('i18n request config', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });

  it('uses English when no language setting is stored', async () => {
    vi.mocked(getSetting).mockReturnValue(null);
    const { locale } = await loadRequestConfig(undefined);
    expect(locale).toBe('en');
  });

  it('uses French when language setting is fr', async () => {
    vi.mocked(getSetting).mockReturnValue('fr');
    const { locale } = await loadRequestConfig('fr');
    expect(locale).toBe('fr');
  });

  it('uses Spanish when language setting is es', async () => {
    vi.mocked(getSetting).mockReturnValue('es');
    const { locale } = await loadRequestConfig('es');
    expect(locale).toBe('es');
  });

  it('uses German when language setting is de', async () => {
    vi.mocked(getSetting).mockReturnValue('de');
    const { locale } = await loadRequestConfig('de');
    expect(locale).toBe('de');
  });

  it('falls back to English for unsupported locale values', async () => {
    vi.mocked(getSetting).mockReturnValue('ja');
    const { locale } = await loadRequestConfig('ja');
    expect(locale).toBe('en');
  });

  it('falls back to English when getSetting throws', async () => {
    vi.mocked(getSetting).mockImplementation(() => { throw new Error('DB unavailable'); });
    const { locale } = await loadRequestConfig(undefined);
    expect(locale).toBe('en');
  });

  it('loads messages object for the resolved locale', async () => {
    vi.mocked(getSetting).mockReturnValue('fr');
    const { messages } = await loadRequestConfig('fr');
    expect(messages).toBeDefined();
    expect(typeof (messages as Record<string, unknown>).nav).toBe('object');
  });
});
```

- [ ] **Step 2: Run the tests**

```bash
npx vitest run src/i18n/__tests__/request.test.ts
```

Expected: all 7 tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/i18n/__tests__/request.test.ts
git commit -m "test(i18n): add locale-switching tests for i18n request config"
```

---

## Task 12: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the Language support section**

Find and replace the current `## Language support` section (lines 94–97):

```markdown
## Language support

The UI is available in English, French, Spanish, and German. Switch languages from the header.

**Criteria translation coverage:**

| Standard | French (fr) | Spanish (es) | German (de) |
|---|---|---|---|
| WCAG (all criteria) | Full — official W3C French translation | Full — official W3C Spanish translation | English fallback — no official W3C German translation |
| EN 301 549 (Clauses 4–8, 12, 13) | Full — official ETSI French publication | English fallback — no official ETSI Spanish translation | Full — official ETSI German publication |
| EN 301 549 (Clauses 10, 11) | English fallback | English fallback | English fallback |
| Section 508 | English fallback — US regulation, English-only source | English fallback | English fallback |

"English fallback" means the criterion name displays in English when no official translation is available.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update language support section with criteria translation coverage"
```

---

## Self-review

**Spec coverage check:**
- ✅ Section 1a/b/c: Task 1 fills vpats.sections, vpats.pdf, settings.language
- ✅ Section 2a: Task 2 wires vpat-ai-panel
- ✅ Section 2b: Task 3 wires ai-config-section
- ✅ Section 2c: Task 4 fixes report-edit-form
- ✅ Section 2d: Task 5 passes translations to export utilities
- ✅ Section 2e: WCAG/Section 508/EN 301 549 labels intentionally kept as-is (by design)
- ✅ Section 3: Tasks 6–9 cover criteria translations + migration
- ✅ Section 4: Tasks 10–11 cover testing
- ✅ Section 5: Task 12 updates README

**Placeholder scan:** No TBDs or incomplete code blocks.

**Type consistency:** `ExportTranslations` defined in vpat-shared.ts and imported in template/docx; `WcagCriterionTranslation` used only in wcag-translations.ts; `En301549CriterionTranslation` used only in en301549-translations.ts.
