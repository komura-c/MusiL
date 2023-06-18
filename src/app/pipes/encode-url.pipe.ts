import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'encodeUrl',
    standalone: true,
})
export class EncodeUrlPipe implements PipeTransform {
  transform(url: string): string {
    return encodeURIComponent(url.replace(/&amp;/g, '&'));
  }
}
