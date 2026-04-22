// src/lib/export/vpat-shared.ts

/** Canonical VPAT 2.x section display order. */
export const SECTION_ORDER = [
  'A',
  'AA',
  'AAA',
  'Chapter3',
  'Chapter5',
  'Chapter6',
  'Clause4',
  'Clause5',
  'Clause11',
  'Clause12',
];

/** Human-readable section headings matching the VPAT 2.x template. */
export const SECTION_LABELS: Record<string, string> = {
  A: 'Table 1: Success Criteria, Level A',
  AA: 'Table 2: Success Criteria, Level AA',
  AAA: 'Table 3: Success Criteria, Level AAA',
  Chapter3: 'Chapter 3: Functional Performance Criteria',
  Chapter5: 'Chapter 5: Software',
  Chapter6: 'Chapter 6: Support Documentation and Services',
  Clause4: 'Clause 4: Functional Performance Statements',
  Clause5: 'Clause 5: Generic Requirements',
  Clause11: 'Clause 11: Non-Web Software',
  Clause12: 'Clauses 11-12: Documentation and Support Services',
};

/** Maps DB conformance enum values to VPAT display strings. */
export const CONFORMANCE_DISPLAY: Record<string, string> = {
  supports: 'Supports',
  partially_supports: 'Partially Supports',
  does_not_support: 'Does Not Support',
  not_applicable: 'Not Applicable',
  not_evaluated: 'Not Evaluated',
};

/** Maps SECTION_LABELS keys to their corresponding message-file keys. */
export const SECTION_MSG_KEY: Record<string, string> = {
  A: 'tableA',
  AA: 'tableAA',
  AAA: 'tableAAA',
  Chapter3: 'chapter3',
  Chapter5: 'chapter5',
  Chapter6: 'chapter6',
  Clause4: 'clause4',
  Clause5: 'clause5',
  Clause11: 'clause11',
  Clause12: 'clause12',
};

/** Optional locale-specific overrides for section and conformance labels in exports. */
export interface ExportTranslations {
  sectionLabels: Record<string, string>;
  conformanceLabels: Record<string, string>;
}

/**
 * Compares two WCAG criterion codes numerically (e.g. "1.2.3" vs "1.10.1").
 * Lexical sort would incorrectly place "1.10" before "1.2".
 */
export function compareCode(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
