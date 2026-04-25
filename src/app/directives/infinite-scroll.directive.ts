import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements AfterViewInit, OnDestroy {
  @Input() rootMargin = '200px';
  @Input() throttleMs = 50;
  @Output() scrolled = new EventEmitter<void>();

  private observer: IntersectionObserver | null = null;
  private lastEmit = 0;

  constructor(
    private host: ElementRef<HTMLElement>,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((e) => e.isIntersecting);
          if (!visible) {
            return;
          }
          const now = Date.now();
          if (now - this.lastEmit < this.throttleMs) {
            return;
          }
          this.lastEmit = now;
          this.ngZone.run(() => this.scrolled.emit());
        },
        { rootMargin: this.rootMargin }
      );
      this.observer.observe(this.host.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
