import { BehaviorSubject } from 'rxjs';

export const FirestoreStub = {
  collection: (name: string) => ({
    doc: (docId: string) => ({
      valueChanges: () => new BehaviorSubject({ id: 'xxx' }),
      set: (setId: string) => new Promise((resolve, reject) => resolve()),
    }),
  }),
};

export const FireStorageStub = {
  ref: (docId: string) => ({
    putString: () => new BehaviorSubject({ id: 'xxx' }),
    delete: () => new Promise((resolve, reject) => resolve()),
  }),
};

export const FireAuthStub = {
  authState: () => new BehaviorSubject({ id: 'xxx' }),
};

export const FireAnalyticsStub = {
  logEvent: (id: string) => new Promise((resolve, reject) => resolve()),
};
