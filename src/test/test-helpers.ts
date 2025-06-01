import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore/lite';
import { Storage } from '@angular/fire/storage';
import { Functions } from '@angular/fire/functions';
import { Analytics } from '@angular/fire/analytics';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import {
  AuthProviderStub,
  FirestoreProviderStub,
  StorageProviderStub,
  FunctionsProviderStub,
  AnalyticsProviderStub,
} from './firebase.stub';
import { ActivatedRouteStub, MockWindowService, MockDocumentService } from './service.stub';
import { of } from 'rxjs';
import { WindowService } from '../app/services/window.service';
import { DocumentService } from '../app/services/document.service';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environmentStub } from './environment.stub';

// Setup AngularFire for testing
(globalThis as any).ɵAngularfireInstanceCache = new Map();

const MatSnackBarStub = {
  open: jasmine
    .createSpy('open')
    .and.returnValue({ dismiss: jasmine.createSpy('dismiss') }),
};

const RouterStub = {
  navigate: jasmine
    .createSpy('navigate')
    .and.returnValue(Promise.resolve(true)),
  navigateByUrl: jasmine
    .createSpy('navigateByUrl')
    .and.returnValue(Promise.resolve(true)),
  events: of([]),
};

const LocationStub = {
  path: jasmine.createSpy('path').and.returnValue('/'),
  back: jasmine.createSpy('back'),
  forward: jasmine.createSpy('forward'),
};

const MetaStub = {
  addTag: jasmine.createSpy('addTag'),
  updateTag: jasmine.createSpy('updateTag'),
  removeTag: jasmine.createSpy('removeTag'),
};

// Create a more complete Document stub with proper DOM methods
const createMockElement = (tagName: string) => {
  const element = document.createElement(tagName);
  // Override appendChild to handle mock elements properly
  const originalAppendChild = element.appendChild;
  element.appendChild = function(this: any, child: any) {
    if (child && typeof child === 'object') {
      return originalAppendChild.call(this, child);
    }
    return child;
  };
  return element;
};

const DocumentStub = {
  querySelector: jasmine.createSpy('querySelector').and.returnValue({
    getAttribute: jasmine.createSpy('getAttribute').and.returnValue(''),
    setAttribute: jasmine.createSpy('setAttribute'),
    appendChild: jasmine.createSpy('appendChild'),
  }),
  querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue([]),
  getElementById: jasmine.createSpy('getElementById').and.returnValue(null),
  getElementsByTagName: jasmine.createSpy('getElementsByTagName').and.returnValue([]),
  createElement: jasmine.createSpy('createElement').and.callFake((tagName: string) => {
    return createMockElement(tagName);
  }),
  createComment: jasmine.createSpy('createComment').and.callFake((text: string) => {
    return document.createComment(text);
  }),
  createTextNode: jasmine.createSpy('createTextNode').and.callFake((text: string) => {
    return document.createTextNode(text);
  }),
  createDocumentFragment: jasmine.createSpy('createDocumentFragment').and.returnValue(
    document.createDocumentFragment()
  ),
  head: createMockElement('head'),
  body: createMockElement('body'),
  documentElement: document.documentElement,
  location: { href: 'http://localhost:4200' },
  title: 'Test Title',
  defaultView: window,
  appendChild: jasmine.createSpy('appendChild'),
  removeChild: jasmine.createSpy('removeChild'),
  replaceChild: jasmine.createSpy('replaceChild'),
};

export const getFirebaseProviders = () => [
  { provide: Auth, useValue: AuthProviderStub },
  { provide: Firestore, useValue: FirestoreProviderStub },
  { provide: Storage, useValue: StorageProviderStub },
  { provide: Functions, useValue: FunctionsProviderStub },
  { provide: Analytics, useValue: AnalyticsProviderStub },
];

export const getCommonProviders = () => [
  ...getFirebaseProviders(),
  { provide: FIREBASE_OPTIONS, useValue: environmentStub.firebase },
  { provide: MatSnackBar, useValue: MatSnackBarStub },
  { provide: Router, useValue: RouterStub },
  { provide: ActivatedRoute, useClass: ActivatedRouteStub },
  { provide: Location, useValue: LocationStub },
  { provide: Meta, useValue: MetaStub },
  { provide: DOCUMENT, useValue: DocumentStub },
  { provide: WindowService, useClass: MockWindowService },
  { provide: DocumentService, useClass: MockDocumentService },
];
