import { Injectable } from '@angular/core';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  scrollPosYs: { [key: string]: number } = {};
  maxAttemptCount = 5;

  constructor(private windowService: WindowService) {}

  saveScrollPosition(id: string): void {
    if (id) {
      this.scrollPosYs[id] = this.windowService.pageYOffset();
    }
  }

  restoreScrollPosition(id: string): void {
    for (
      let attemptCount = 0;
      attemptCount < this.maxAttemptCount;
      attemptCount++
    ) {
      const position = this.scrollPosYs[id] ? this.scrollPosYs[id] : 0;
      setTimeout(() => {
        this.windowService.scrollTo(0, position);
      }, 30);
    }
  }
}
