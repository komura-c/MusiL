import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToLink',
  standalone: true,
})
export class StringToLinkPipe implements PipeTransform {
  transform(text: string): string {
    const linkReg = new RegExp(
      /(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#-_]+)/gi
    );
    const toATag =
      "<a href='$1' target='_blank' rel='nofollow noopener noreferrer'>$1</a>";
    return text.replace(linkReg, toATag);
  }
}
