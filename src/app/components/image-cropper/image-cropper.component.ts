import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

export interface ImageCroppedResult {
  base64: string;
}

@Component({
    selector: 'app-image-cropper',
    imports: [NgIf],
    template: `
    <div
      class="cropper-host"
      *ngIf="!hasError"
      #host
      (mousedown)="onPointerDown($event)"
      (touchstart)="onPointerDown($event)"
    >
      <img
        #img
        *ngIf="objectUrl"
        [src]="objectUrl"
        (load)="onImageLoaded()"
        (error)="onImageError()"
        draggable="false"
      />
      <div
        class="crop-frame"
        *ngIf="ready"
        [style.left.px]="frame.x"
        [style.top.px]="frame.y"
        [style.width.px]="frame.size"
        [style.height.px]="frame.size"
      ></div>
    </div>
  `,
    styles: [
        `
      :host {
        display: block;
      }
      .cropper-host {
        position: relative;
        user-select: none;
        touch-action: none;
        max-width: 100%;
        overflow: hidden;
      }
      .cropper-host img {
        display: block;
        width: 100%;
        height: auto;
        pointer-events: none;
      }
      .crop-frame {
        position: absolute;
        border: 2px solid #fff;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.45);
        cursor: move;
        box-sizing: border-box;
      }
    `,
    ]
})
export class ImageCropperComponent implements AfterViewInit, OnChanges {
  @Input() imageChangedEvent: Event | string | null = null;
  @Input() resizeToWidth = 300;
  @Input() format: 'png' | 'jpeg' = 'png';

  @Output() imageLoaded = new EventEmitter<void>();
  @Output() imageCropped = new EventEmitter<ImageCroppedResult>();
  @Output() loadImageFailed = new EventEmitter<void>();

  @ViewChild('host') hostRef?: ElementRef<HTMLDivElement>;
  @ViewChild('img') imgRef?: ElementRef<HTMLImageElement>;

  objectUrl: string | null = null;
  ready = false;
  hasError = false;
  frame = { x: 0, y: 0, size: 0 };

  private dragOffset: { x: number; y: number } | null = null;
  private currentObjectUrl: string | null = null;

  ngAfterViewInit(): void {
    // wait for input changes
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageChangedEvent']) {
      this.handleEvent(this.imageChangedEvent);
    }
  }

  private handleEvent(event: Event | string | null): void {
    this.revokeObjectUrl();
    this.ready = false;
    this.hasError = false;
    if (!event || typeof event === 'string') {
      this.objectUrl = null;
      return;
    }
    const target = event.target as HTMLInputElement | null;
    const file = target?.files?.[0];
    if (!file) {
      this.objectUrl = null;
      return;
    }
    this.currentObjectUrl = URL.createObjectURL(file);
    this.objectUrl = this.currentObjectUrl;
  }

  onImageLoaded(): void {
    if (!this.imgRef || !this.hostRef) {
      return;
    }
    const img = this.imgRef.nativeElement;
    const host = this.hostRef.nativeElement;
    const rect = host.getBoundingClientRect();
    const minSide = Math.min(rect.width, img.clientHeight || rect.width);
    const initial = Math.max(50, Math.floor(minSide));
    this.frame = {
      size: initial,
      x: Math.max(0, (rect.width - initial) / 2),
      y: Math.max(0, (img.clientHeight - initial) / 2),
    };
    this.ready = true;
    this.imageLoaded.emit();
    this.emitCropped();
  }

  onImageError(): void {
    this.hasError = true;
    this.loadImageFailed.emit();
  }

  onPointerDown(event: MouseEvent | TouchEvent): void {
    if (!this.ready) {
      return;
    }
    const point = this.getPoint(event);
    const inside =
      point.x >= this.frame.x &&
      point.x <= this.frame.x + this.frame.size &&
      point.y >= this.frame.y &&
      point.y <= this.frame.y + this.frame.size;
    if (!inside) {
      return;
    }
    event.preventDefault();
    this.dragOffset = {
      x: point.x - this.frame.x,
      y: point.y - this.frame.y,
    };
    const move = (e: MouseEvent | TouchEvent) => this.onPointerMove(e);
    const up = () => {
      this.dragOffset = null;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
      this.emitCropped();
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
  }

  private onPointerMove(event: MouseEvent | TouchEvent): void {
    if (!this.dragOffset || !this.imgRef) {
      return;
    }
    event.preventDefault();
    const point = this.getPoint(event);
    const img = this.imgRef.nativeElement;
    const maxX = Math.max(0, img.clientWidth - this.frame.size);
    const maxY = Math.max(0, img.clientHeight - this.frame.size);
    this.frame = {
      ...this.frame,
      x: Math.min(maxX, Math.max(0, point.x - this.dragOffset.x)),
      y: Math.min(maxY, Math.max(0, point.y - this.dragOffset.y)),
    };
  }

  private getPoint(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const host = this.hostRef!.nativeElement;
    const rect = host.getBoundingClientRect();
    const source =
      'touches' in event && event.touches.length
        ? event.touches[0]
        : ('clientX' in event
            ? event
            : (event as TouchEvent).changedTouches[0]) as MouseEvent | Touch;
    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
    };
  }

  private emitCropped(): void {
    if (!this.imgRef) {
      return;
    }
    const img = this.imgRef.nativeElement;
    const scale = img.naturalWidth / img.clientWidth;
    const sx = this.frame.x * scale;
    const sy = this.frame.y * scale;
    const sSize = this.frame.size * scale;
    const canvas = document.createElement('canvas');
    canvas.width = this.resizeToWidth;
    canvas.height = this.resizeToWidth;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.drawImage(
      img,
      sx,
      sy,
      sSize,
      sSize,
      0,
      0,
      this.resizeToWidth,
      this.resizeToWidth
    );
    const mime = this.format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const base64 = canvas.toDataURL(mime);
    this.imageCropped.emit({ base64 });
  }

  private revokeObjectUrl(): void {
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }
}
