import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  scrollPosYs: { [key: string]: number } = {};
  maxAttemptCount = 5;

  constructor() { }

  saveScrollPosition(id: string): void {
    if (id) {
      this.scrollPosYs[id] = window.pageYOffset;
    }
  }

  restoreScrollPosition(id: string): void {
    for (let attemptCount = 0; attemptCount < this.maxAttemptCount; attemptCount++) {
      const position = this.scrollPosYs[id] ? this.scrollPosYs[id] : 0;
      setTimeout(() => {
        window.scroll(0, position);
      }, 30);
    }
  }
}
