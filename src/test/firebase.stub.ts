import { BehaviorSubject } from 'rxjs';

export const FirestoreStub = {
  collection: (name: string) => ({
    doc: (docId: string) => ({
      valueChanges: () => new BehaviorSubject({ id: 'xxx' }),
      set: (setId: string) =>
        new Promise((resolve, reject) => resolve(undefined)),
    }),
  }),
};

export const FireStorageStub = {
  ref: (docId: string) => ({
    putString: () => new BehaviorSubject({ id: 'xxx' }),
    delete: () => new Promise((resolve, reject) => resolve(undefined)),
  }),
};

export const FireAuthStub = {
  authState: () => new BehaviorSubject({ id: 'xxx' }),
};

export const FireAnalyticsStub = {
  logEvent: (id: string) =>
    new Promise((resolve, reject) => resolve(undefined)),
};

export const FireFunctionsStub = {
  httpsCallable: () => () => new Promise((resolve) => resolve({ data: {} })),
};

export const FirebaseServiceStub = {
  auth: FireAuthStub,
  firestore: FirestoreStub,
  storage: FireStorageStub,
  functions: FireFunctionsStub,
  analytics: FireAnalyticsStub,
};

export const FirestoreProviderStub = {
  collection: jasmine.createSpy('collection').and.returnValue({
    doc: jasmine.createSpy('doc').and.returnValue({
      valueChanges: jasmine.createSpy('valueChanges').and.returnValue(new BehaviorSubject({ id: 'xxx' })),
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve(undefined)),
    }),
  }),
  doc: jasmine.createSpy('doc').and.returnValue({
    get: jasmine.createSpy('get').and.returnValue(Promise.resolve({
      exists: jasmine.createSpy('exists').and.returnValue(true),
      data: jasmine.createSpy('data').and.returnValue({ id: 'xxx' }),
    })),
    set: jasmine.createSpy('set').and.returnValue(Promise.resolve(undefined)),
    update: jasmine.createSpy('update').and.returnValue(Promise.resolve(undefined)),
    delete: jasmine.createSpy('delete').and.returnValue(Promise.resolve(undefined)),
  }),
};

export const AuthProviderStub = {
  onAuthStateChanged: jasmine.createSpy('onAuthStateChanged').and.returnValue(
    jasmine.createSpy('unsubscribe')
  ),
  currentUser: null as any,
  signInWithPopup: jasmine.createSpy('signInWithPopup').and.returnValue(
    Promise.resolve({ user: { uid: 'test-uid' } })
  ),
  signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve()),
};

export const StorageProviderStub = {
  ref: (docId: string) => ({
    putString: () => new BehaviorSubject({ id: 'xxx' }),
    delete: () => new Promise((resolve, reject) => resolve(undefined)),
  }),
};

export const FunctionsProviderStub = {
  httpsCallable: () => () => new Promise((resolve) => resolve({ data: {} })),
};

export const AnalyticsProviderStub = {
  logEvent: (id: string) =>
    new Promise((resolve, reject) => resolve(undefined)),
};
