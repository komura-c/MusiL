import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHTMLPipe } from './safe-html.pipe';

describe('SafeHTMLPipe', () => {
  let pipe: SafeHTMLPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const sanitizer = TestBed.inject(DomSanitizer);
    pipe = new SafeHTMLPipe(sanitizer);
  });

  it('returns SafeHtml for given html string', () => {
    const result = pipe.transform('<p>hi</p>');
    expect(result).toBeTruthy();
  });
});
