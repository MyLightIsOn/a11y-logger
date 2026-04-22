// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { SECTION_ORDER, SECTION_LABELS, CONFORMANCE_DISPLAY, compareCode } from '../vpat-shared';

describe('SECTION_ORDER', () => {
  it('contains all 10 canonical VPAT sections', () => {
    expect(SECTION_ORDER).toHaveLength(10);
    expect(SECTION_ORDER).toContain('A');
    expect(SECTION_ORDER).toContain('AAA');
    expect(SECTION_ORDER).toContain('Clause11');
    expect(SECTION_ORDER).toContain('Clause12');
  });
});

describe('SECTION_LABELS', () => {
  it('maps every section in SECTION_ORDER to a label', () => {
    for (const section of SECTION_ORDER) {
      expect(SECTION_LABELS[section]).toBeDefined();
    }
  });

  it('uses canonical VPAT 2.x label for Level A', () => {
    expect(SECTION_LABELS['A']).toBe('Table 1: Success Criteria, Level A');
  });
});

describe('CONFORMANCE_DISPLAY', () => {
  it('maps all five conformance values', () => {
    expect(CONFORMANCE_DISPLAY['supports']).toBe('Supports');
    expect(CONFORMANCE_DISPLAY['partially_supports']).toBe('Partially Supports');
    expect(CONFORMANCE_DISPLAY['does_not_support']).toBe('Does Not Support');
    expect(CONFORMANCE_DISPLAY['not_applicable']).toBe('Not Applicable');
    expect(CONFORMANCE_DISPLAY['not_evaluated']).toBe('Not Evaluated');
  });
});

describe('compareCode', () => {
  it('sorts numerically not lexically', () => {
    expect(compareCode('1.2.3', '1.10.1')).toBeLessThan(0);
  });

  it('returns 0 for equal codes', () => {
    expect(compareCode('1.2.3', '1.2.3')).toBe(0);
  });

  it('handles codes of different lengths', () => {
    expect(compareCode('1.1', '1.1.1')).toBeLessThan(0);
  });
});
