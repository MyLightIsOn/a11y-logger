// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next-intl/server so getRequestConfig is a simple identity function,
// matching the react-server build behaviour used at runtime.
vi.mock('next-intl/server', () => ({
  getRequestConfig: (fn: unknown) => fn,
}));

vi.mock('@/lib/db/settings', () => ({
  getSetting: vi.fn(),
}));

import { getSetting } from '@/lib/db/settings';
import requestConfig from '../request';

describe('i18n request config', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function getConfig(mockLocale: string | null) {
    vi.mocked(getSetting).mockReturnValue(mockLocale as ReturnType<typeof getSetting>);
    return requestConfig({} as Parameters<typeof requestConfig>[0]);
  }

  it('uses English when no language setting is stored', async () => {
    const result = await getConfig(null);
    expect(result.locale).toBe('en');
  });

  it('uses French when language setting is fr', async () => {
    const result = await getConfig('fr');
    expect(result.locale).toBe('fr');
  });

  it('uses Spanish when language setting is es', async () => {
    const result = await getConfig('es');
    expect(result.locale).toBe('es');
  });

  it('uses German when language setting is de', async () => {
    const result = await getConfig('de');
    expect(result.locale).toBe('de');
  });

  it('falls back to English for unsupported locale values', async () => {
    const result = await getConfig('ja');
    expect(result.locale).toBe('en');
  });

  it('falls back to English when getSetting throws', async () => {
    vi.mocked(getSetting).mockImplementation(() => {
      throw new Error('DB unavailable');
    });
    const result = await requestConfig({} as Parameters<typeof requestConfig>[0]);
    expect(result.locale).toBe('en');
  });

  it('returns messages object for resolved locale', async () => {
    const result = await getConfig('fr');
    expect(result.messages).toBeDefined();
    expect(typeof (result.messages as Record<string, unknown>).nav).toBe('object');
  });
});
