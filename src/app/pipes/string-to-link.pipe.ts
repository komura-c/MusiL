import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'stringToLink',
})
export class StringToLinkPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(text: string): string {
    const safeText = this.sanitizer.sanitize(SecurityContext.HTML, text);
    const linkReg = new RegExp(
      /(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#-_]+)/gi
    );
    const toATag =
      "<a href='$1' target='_blank' rel='nofollow noopener noreferrer'>$1</a>";
    return safeText.replace(linkReg, toATag);
  }
}
