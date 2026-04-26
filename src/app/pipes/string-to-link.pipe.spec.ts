import { StringToLinkPipe } from './string-to-link.pipe';

describe('StringToLinkPipe', () => {
  let pipe: StringToLinkPipe;

  beforeEach(() => {
    pipe = new StringToLinkPipe();
  });

  it('wraps http(s) URLs in anchor tags', () => {
    const out = pipe.transform('see https://example.com here');
    expect(out).toContain("href='https://example.com'");
    expect(out).toContain("target='_blank'");
    expect(out).toContain('rel=');
  });

  it('returns text unchanged when no URL', () => {
    expect(pipe.transform('plain text')).toBe('plain text');
  });
});
