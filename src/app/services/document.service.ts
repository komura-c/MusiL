import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  get nativeDocument(): Document {
    return this.document;
  }

  get body(): HTMLElement | null {
    return this.document.body;
  }

  get head(): HTMLHeadElement {
    return this.document.head;
  }

  get documentElement(): HTMLElement {
    return this.document.documentElement;
  }

  get location(): Location {
    return this.document.location;
  }

  get title(): string {
    return this.document.title;
  }

  set title(value: string) {
    this.document.title = value;
  }

  getElementById(elementId: string): HTMLElement | null {
    return this.document.getElementById(elementId);
  }

  getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
    return this.document.getElementsByClassName(classNames);
  }

  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element> {
    return this.document.getElementsByTagName(qualifiedName);
  }

  querySelector(selectors: string): Element | null {
    return this.document.querySelector(selectors);
  }

  querySelectorAll(selectors: string): NodeListOf<Element> {
    return this.document.querySelectorAll(selectors);
  }

  createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
  createElement(tagName: string): HTMLElement {
    return this.document.createElement(tagName);
  }

  createTextNode(data: string): Text {
    return this.document.createTextNode(data);
  }

  createDocumentFragment(): DocumentFragment {
    return this.document.createDocumentFragment();
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    this.document.addEventListener(type, listener, options);
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
    this.document.removeEventListener(type, listener, options);
  }

  dispatchEvent(event: Event): boolean {
    return this.document.dispatchEvent(event);
  }

  createEvent(eventInterface: string): Event {
    return this.document.createEvent(eventInterface);
  }

  execCommand(commandId: string, showUI?: boolean, value?: string): boolean {
    return this.document.execCommand(commandId, showUI, value);
  }

  hasFocus(): boolean {
    return this.document.hasFocus();
  }

  getSelection(): Selection | null {
    return this.document.getSelection();
  }

  cookie(): string {
    return this.document.cookie;
  }

  setCookie(value: string): void {
    this.document.cookie = value;
  }

  createRange(): Range {
    return this.document.createRange();
  }

  adoptNode(node: Node): Node {
    return this.document.adoptNode(node);
  }

  importNode(node: Node, deep: boolean): Node {
    return this.document.importNode(node, deep);
  }

  elementFromPoint(x: number, y: number): Element | null {
    return this.document.elementFromPoint(x, y);
  }

  caretPositionFromPoint(x: number, y: number): any | null {
    // CaretPosition is not available in all browsers
    return (this.document as any).caretPositionFromPoint?.(x, y) || null;
  }

  createNodeIterator(root: Node, whatToShow?: number, filter?: NodeFilter | null): NodeIterator {
    return this.document.createNodeIterator(root, whatToShow, filter);
  }

  createTreeWalker(root: Node, whatToShow?: number, filter?: NodeFilter | null): TreeWalker {
    return this.document.createTreeWalker(root, whatToShow, filter);
  }
}