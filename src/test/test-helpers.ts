import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import {
  AuthProviderStub,
  FirestoreProviderStub,
  StorageProviderStub,
  FunctionsProviderStub,
  AnalyticsProviderStub,
} from './firebase.stub';
import {
  ActivatedRouteStub,
  MockWindowService,
  MockDocumentService,
} from './service.stub';
import { of } from 'rxjs';
import { WindowService } from '../app/services/window.service';
import { DocumentService } from '../app/services/document.service';
import { FirebaseService } from '../app/services/firebase.service';

// Ensure document.defaultView is available for @HostListener
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Simply ensure document.defaultView exists and points to window
  try {
    Object.defineProperty(document, 'defaultView', {
      value: window,
      writable: true,
      configurable: true,
    });
  } catch (e) {
    // Property might already exist, that's fine
  }
}

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
  element.appendChild = function (this: any, child: any) {
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
  getElementsByClassName: jasmine
    .createSpy('getElementsByClassName')
    .and.returnValue([]),
  getElementsByTagName: jasmine
    .createSpy('getElementsByTagName')
    .and.returnValue([]),
  createElement: jasmine
    .createSpy('createElement')
    .and.callFake((tagName: string) => {
      return createMockElement(tagName);
    }),
  createComment: jasmine
    .createSpy('createComment')
    .and.callFake((text: string) => {
      return document.createComment(text);
    }),
  createTextNode: jasmine
    .createSpy('createTextNode')
    .and.callFake((text: string) => {
      return document.createTextNode(text);
    }),
  createDocumentFragment: jasmine
    .createSpy('createDocumentFragment')
    .and.returnValue(document.createDocumentFragment()),
  head: createMockElement('head'),
  body: createMockElement('body'),
  documentElement: document.documentElement,
  location: { href: 'http://localhost:4200' },
  title: 'Test Title',
  defaultView: window,
  appendChild: jasmine.createSpy('appendChild'),
  removeChild: jasmine.createSpy('removeChild'),
  replaceChild: jasmine.createSpy('replaceChild'),
  addEventListener: jasmine.createSpy('addEventListener'),
  removeEventListener: jasmine.createSpy('removeEventListener'),
};

// Mock FirebaseService — メソッド単位でスパイ可能なよう全ラッパー API をスタブ化
const MockFirebaseService = {
  auth: AuthProviderStub,
  firestore: FirestoreProviderStub,
  storage: StorageProviderStub,
  functions: FunctionsProviderStub,
  analytics: AnalyticsProviderStub,

  // Firestore wrappers
  collection: jasmine.createSpy('collection').and.returnValue({}),
  doc: jasmine.createSpy('doc').and.returnValue({ id: 'mock-doc-id' }),
  query: jasmine.createSpy('query').and.returnValue({}),
  getDoc: jasmine.createSpy('getDoc').and.returnValue(
    Promise.resolve({
      exists: () => true,
      data: () => ({}),
    })
  ),
  collectionData: jasmine
    .createSpy('collectionData')
    .and.returnValue(of([])),
  setDoc: jasmine.createSpy('setDoc').and.returnValue(Promise.resolve()),
  updateDoc: jasmine.createSpy('updateDoc').and.returnValue(Promise.resolve()),
  deleteDoc: jasmine.createSpy('deleteDoc').and.returnValue(Promise.resolve()),

  // Storage wrappers
  storageRef: jasmine.createSpy('storageRef').and.returnValue({}),
  uploadBytes: jasmine
    .createSpy('uploadBytes')
    .and.returnValue(Promise.resolve('https://example.com/image.png')),
  uploadString: jasmine
    .createSpy('uploadString')
    .and.returnValue(Promise.resolve('https://example.com/image.png')),

  // Auth wrappers
  authState$: jasmine.createSpy('authState$').and.returnValue(of(null)),
  signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve()),
  deleteCurrentUser: jasmine
    .createSpy('deleteCurrentUser')
    .and.returnValue(Promise.resolve()),
  signInWithTwitter: jasmine
    .createSpy('signInWithTwitter')
    .and.returnValue(Promise.resolve({ user: { uid: 'test-uid' } })),
  getAdditionalUserInfo: jasmine
    .createSpy('getAdditionalUserInfo')
    .and.returnValue({ profile: {} }),

  // Functions
  callFunction: jasmine
    .createSpy('callFunction')
    .and.returnValue(Promise.resolve({ data: {} })),

  // Analytics
  logEvent: jasmine.createSpy('logEvent'),
  setUserId: jasmine.createSpy('setUserId'),
};

export const getFirebaseProviders = () => [
  { provide: FirebaseService, useValue: MockFirebaseService },
];

export const getCommonProviders = () => [
  ...getFirebaseProviders(),
  { provide: MatSnackBar, useValue: MatSnackBarStub },
  { provide: Router, useValue: RouterStub },
  { provide: ActivatedRoute, useClass: ActivatedRouteStub },
  { provide: Location, useValue: LocationStub },
  { provide: Meta, useValue: MetaStub },
  { provide: WindowService, useClass: MockWindowService },
  { provide: DocumentService, useClass: MockDocumentService },
];
