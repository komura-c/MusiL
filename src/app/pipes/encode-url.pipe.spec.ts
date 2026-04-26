import { EncodeUrlPipe } from './encode-url.pipe';

describe('EncodeUrlPipe', () => {
  let pipe: EncodeUrlPipe;

  beforeEach(() => {
    pipe = new EncodeUrlPipe();
  });

  it('encodes URL safely', () => {
    expect(pipe.transform('https://example.com/?a=1&b=2')).toBe(
      'https%3A%2F%2Fexample.com%2F%3Fa%3D1%26b%3D2'
    );
  });

  it('decodes &amp; before encoding', () => {
    expect(pipe.transform('a&amp;b')).toBe('a%26b');
  });
});
