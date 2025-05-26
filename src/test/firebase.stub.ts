import { BehaviorSubject } from 'rxjs';

export const FirestoreStub = {
  collection: (name: string) => ({
    doc: (docId: string) => ({
      valueChanges: () => new BehaviorSubject({ id: 'xxx' }),
      set: (setId: string) => new Promise((resolve, reject) => resolve(undefined)),
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
  logEvent: (id: string) => new Promise((resolve, reject) => resolve(undefined)),
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
