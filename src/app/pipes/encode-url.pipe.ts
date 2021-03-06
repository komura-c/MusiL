import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'encodeUrl',
})
export class EncodeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string): string {
    const safeURL = this.sanitizer.sanitize(SecurityContext.HTML, url);
    return encodeURIComponent(safeURL.replace(/&amp;/g, '&'));
  }
}
