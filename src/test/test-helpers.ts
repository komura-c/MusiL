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

const DocumentStub = {
  querySelector: jasmine.createSpy('querySelector').and.returnValue({
    getAttribute: jasmine.createSpy('getAttribute').and.returnValue(''),
    setAttribute: jasmine.createSpy('setAttribute'),
  }),
  querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue([]),
  getElementById: jasmine.createSpy('getElementById').and.returnValue(null),
  createElement: jasmine.createSpy('createElement').and.callFake((tagName: string) => {
    return document.createElement(tagName);
  }),
  head: document.createElement('head'),
  body: document.createElement('body'),
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
  { provide: MatSnackBar, useValue: MatSnackBarStub },
  { provide: Router, useValue: RouterStub },
  { provide: ActivatedRoute, useClass: ActivatedRouteStub },
  { provide: Location, useValue: LocationStub },
  { provide: Meta, useValue: MetaStub },
  { provide: DOCUMENT, useValue: DocumentStub },
  { provide: WindowService, useClass: MockWindowService },
  { provide: DocumentService, useClass: MockDocumentService },
];
