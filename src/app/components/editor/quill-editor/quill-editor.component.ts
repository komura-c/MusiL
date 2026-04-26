import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  dynamicImportQuill,
  QuillEditorInstance,
} from 'src/app/lib/quill';

interface QuillLike extends QuillEditorInstance {
  root: HTMLElement;
  enable(enabled: boolean): void;
  on(event: string, handler: (...args: unknown[]) => void): void;
  off(event: string, handler: (...args: unknown[]) => void): void;
  clipboard: {
    dangerouslyPasteHTML(index: number, html: string): void;
  };
  setText(text: string): void;
  setContents(delta: unknown): void;
  getLength(): number;
  hasFocus(): boolean;
}

@Component({
    selector: 'app-quill-editor',
    template: `<div #host [ngStyle]="hostStyles"></div>`,
    styles: [':host { display: block; width: 100%; }'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => QuillEditorComponent),
            multi: true,
        },
    ],
    imports: [NgStyle]
})
export class QuillEditorComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor
{
  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLDivElement>;

  @Input() modules: Record<string, unknown> = {};
  @Input() placeholder = '';
  @Input() theme = 'snow';
  @Input() defaultEmptyValue: string | null = '';
  @Input() scrollingContainer: string | HTMLElement | null = null;
  @Input() hostStyles: { [key: string]: string } = {
    'min-height': '300px',
    height: '100%',
  };

  @Output() editorCreated = new EventEmitter<QuillEditorInstance>();

  private quill: QuillLike | null = null;
  private pendingValue: string | null = null;
  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private disabled = false;
  private textChangeHandler = () => this.handleTextChange();
  private selectionChangeHandler = (range: unknown) =>
    this.handleSelectionChange(range);

  constructor(private ngZone: NgZone) {}

  async ngAfterViewInit(): Promise<void> {
    await dynamicImportQuill();
    const Quill = (await import('quill')).default as unknown as new (
      el: HTMLElement,
      options: Record<string, unknown>
    ) => QuillLike;

    this.ngZone.runOutsideAngular(() => {
      this.quill = new Quill(this.hostRef.nativeElement, {
        theme: this.theme,
        placeholder: this.placeholder,
        modules: this.modules,
        scrollingContainer: this.scrollingContainer ?? undefined,
      });

      if (this.pendingValue !== null) {
        this.applyValue(this.pendingValue);
        this.pendingValue = null;
      }

      if (this.disabled) {
        this.quill.enable(false);
      }

      this.quill.on('text-change', this.textChangeHandler);
      this.quill.on('selection-change', this.selectionChangeHandler);
    });

    this.editorCreated.emit(this.quill as QuillEditorInstance);
  }

  ngOnDestroy(): void {
    if (!this.quill) {
      return;
    }
    this.quill.off('text-change', this.textChangeHandler);
    this.quill.off('selection-change', this.selectionChangeHandler);
    this.quill = null;
  }

  writeValue(value: string | null): void {
    if (!this.quill) {
      this.pendingValue = value;
      return;
    }
    this.applyValue(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.quill) {
      this.quill.enable(!isDisabled);
    }
  }

  private applyValue(value: string | null): void {
    if (!this.quill) {
      return;
    }
    const html = value ?? this.defaultEmptyValue ?? '';
    this.quill.setContents([] as unknown);
    if (html) {
      this.quill.clipboard.dangerouslyPasteHTML(0, html);
    }
  }

  private handleTextChange(): void {
    if (!this.quill) {
      return;
    }
    const html = this.quill.root.innerHTML;
    const isEmpty = this.quill.getLength() <= 1;
    const value = isEmpty ? this.defaultEmptyValue ?? '' : html;
    this.ngZone.run(() => this.onChange(value));
  }

  private handleSelectionChange(range: unknown): void {
    if (range === null) {
      this.ngZone.run(() => this.onTouched());
    }
  }
}
