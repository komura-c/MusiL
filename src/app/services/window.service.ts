import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  private _window: Window | undefined;

  constructor() {
    this._window = typeof window !== 'undefined' ? window : undefined;
  }

  get nativeWindow(): Window | undefined {
    return this._window;
  }

  get location(): Location | undefined {
    return this._window?.location;
  }

  get localStorage(): Storage | undefined {
    return this._window?.localStorage;
  }

  get sessionStorage(): Storage | undefined {
    return this._window?.sessionStorage;
  }

  get navigator(): Navigator | undefined {
    return this._window?.navigator;
  }

  get history(): History | undefined {
    return this._window?.history;
  }

  open(url?: string | URL, target?: string, features?: string): Window | null {
    return this._window?.open(url, target, features) || null;
  }

  scrollTo(x: number, y: number): void {
    this._window?.scrollTo(x, y);
  }

  scrollBy(x: number, y: number): void {
    this._window?.scrollBy(x, y);
  }

  alert(message?: any): void {
    this._window?.alert(message);
  }

  confirm(message?: string): boolean {
    return this._window?.confirm(message) || false;
  }

  prompt(message?: string, defaultText?: string): string | null {
    return this._window?.prompt(message, defaultText) || null;
  }

  getComputedStyle(element: Element, pseudoElt?: string | null): CSSStyleDeclaration | null {
    return this._window?.getComputedStyle(element, pseudoElt) || null;
  }

  matchMedia(query: string): MediaQueryList | null {
    return this._window?.matchMedia(query) || null;
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    this._window?.addEventListener(type, listener, options);
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
    this._window?.removeEventListener(type, listener, options);
  }

  dispatchEvent(event: Event): boolean {
    return this._window?.dispatchEvent(event) || false;
  }

  reload(): void {
    this._window?.location.reload();
  }

  innerWidth(): number {
    return this._window?.innerWidth || 0;
  }

  innerHeight(): number {
    return this._window?.innerHeight || 0;
  }

  pageXOffset(): number {
    return this._window?.pageXOffset || 0;
  }

  pageYOffset(): number {
    return this._window?.pageYOffset || 0;
  }
}