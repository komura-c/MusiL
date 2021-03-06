import { EncodeUrlPipe } from './encode-url.pipe';

describe('EncodeUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new EncodeUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
