import { describe, it, expect } from 'vitest';
import { getLanguageName } from '../language';

describe('getLanguageName', () => {
  it('maps en to English', () => expect(getLanguageName('en')).toBe('English'));
  it('maps fr to French', () => expect(getLanguageName('fr')).toBe('French'));
  it('maps es to Spanish', () => expect(getLanguageName('es')).toBe('Spanish'));
  it('maps de to German', () => expect(getLanguageName('de')).toBe('German'));
  it('defaults to English for unknown locale', () => expect(getLanguageName('xx')).toBe('English'));
});
