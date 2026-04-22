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
