// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { parseReportContent, escapeHtml } from '../report-shared';

describe('parseReportContent', () => {
  it('parses a valid JSON string', () => {
    const result = parseReportContent('{"executive_summary":{"body":"hello"}}');
    expect(result).toEqual({ executive_summary: { body: 'hello' } });
  });

  it('returns {} for invalid JSON', () => {
    expect(parseReportContent('not json')).toEqual({});
  });

  it('returns {} for null', () => {
    expect(parseReportContent(null)).toEqual({});
  });

  it('returns {} for undefined', () => {
    expect(parseReportContent(undefined)).toEqual({});
  });

  it('returns {} when parsed value is an array', () => {
    expect(parseReportContent('[1,2,3]')).toEqual({});
  });
});

describe('escapeHtml', () => {
  it('escapes all five special characters', () => {
    expect(escapeHtml('a & b < c > d " e \' f')).toBe('a &amp; b &lt; c &gt; d &quot; e &#39; f');
  });

  it('returns the string unchanged if no special characters', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });
});
