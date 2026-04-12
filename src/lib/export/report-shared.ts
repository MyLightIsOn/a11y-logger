// src/lib/export/report-shared.ts
import type { ReportContent } from '@/lib/validators/reports';

/**
 * Safely parses a JSON-encoded ReportContent blob from the database.
 * Returns an empty object on any parse failure, null, or non-object input.
 *
 * @param content - Raw JSON string from the `reports.content` column, or null/undefined.
 */
export function parseReportContent(content: string | null | undefined): ReportContent {
  try {
    const parsed = JSON.parse(content ?? '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as ReportContent)
      : {};
  } catch {
    return {};
  }
}

/**
 * Escapes the five HTML special characters to their entity equivalents.
 * Use when injecting user-supplied text into an HTML template string.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
