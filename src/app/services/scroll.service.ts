import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  scrollPosYs: { [key: string]: number } = {};

  constructor() {}

  saveScrollPosition(id: string): void {
    if (id) {
      this.scrollPosYs[id] = window.pageYOffset;
    }
  }

  restoreScrollPosition(id: string): void {
    if (id) {
      setTimeout(() => {
        window.scrollTo(0, this.scrollPosYs[id]);
      }, 100);
    }
  }
}
