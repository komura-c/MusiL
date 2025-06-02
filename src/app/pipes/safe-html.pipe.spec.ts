import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHTMLPipe } from './safe-html.pipe';

describe('SafeHTMLPipe', () => {
  it('create an instance', () => {
    TestBed.configureTestingModule({});
    const sanitizer = TestBed.inject(DomSanitizer);
    const pipe = new SafeHTMLPipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});
