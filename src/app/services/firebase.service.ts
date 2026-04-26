import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
  TwitterAuthProvider,
  User,
  UserCredential,
} from 'firebase/auth';
import {
  Firestore,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QueryConstraint,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore/lite';
import {
  FirebaseStorage,
  getStorage,
  StorageReference,
  ref as storageRef,
  uploadBytes,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';
import {
  Functions,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import {
  Analytics,
  getAnalytics,
  logEvent,
  setUserId,
} from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore/lite';
import { environment } from 'src/environments/environment';

/**
 * Firebase JS SDK のラッパー。すべての Firestore/Auth/Storage/Functions/Analytics
 * 呼び出しはこのサービスを経由することで、テスト時にメソッド単位でスパイ可能。
 */
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  readonly app: FirebaseApp;
  readonly auth: Auth;
  readonly firestore: Firestore;
  readonly storage: FirebaseStorage;
  readonly functions: Functions;
  readonly analytics: Analytics;

  constructor(private readonly ngZone: NgZone, router: Router) {
    this.app = initializeApp(environment.firebase);
    this.auth = getAuth(this.app);
    this.firestore = getFirestore(this.app);
    this.storage = getStorage(this.app);
    this.functions = getFunctions(this.app, 'asia-northeast1');
    this.analytics = getAnalytics(this.app);

    this.ngZone.runOutsideAngular(() => {
      router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe((e) => {
          const ev = e as NavigationEnd;
          this.logEvent('screen_view', { screen_name: ev.urlAfterRedirects });
        });
    });
  }

  // ===== Firestore =====
  collection<T>(path: string): CollectionReference<T> {
    return collection(this.firestore, path) as CollectionReference<T>;
  }

  doc<T = unknown>(path: string): DocumentReference<T>;
  doc<T>(parent: CollectionReference<T>, id?: string): DocumentReference<T>;
  doc<T>(
    pathOrParent: string | CollectionReference<T>,
    id?: string
  ): DocumentReference<T> {
    if (typeof pathOrParent === 'string') {
      return doc(this.firestore, pathOrParent) as DocumentReference<T>;
    }
    return id
      ? (doc(pathOrParent, id) as DocumentReference<T>)
      : (doc(pathOrParent) as DocumentReference<T>);
  }

  query<T>(
    base: CollectionReference<T> | Query<T>,
    ...constraints: QueryConstraint[]
  ): Query<T> {
    return query(base, ...constraints);
  }

  getDoc<T>(ref: DocumentReference<T>): Promise<DocumentSnapshot<T>> {
    return getDoc(ref);
  }

  collectionData<T>(q: Query<T>): Observable<T[]> {
    return from(getDocs(q)).pipe(
      map((snap) => snap.docs.map((d) => d.data() as T))
    );
  }

  setDoc<T>(ref: DocumentReference<T>, data: T): Promise<void> {
    return setDoc(ref, data);
  }

  updateDoc<T>(ref: DocumentReference<T>, data: Partial<T>): Promise<void> {
    return updateDoc(ref, data as never);
  }

  deleteDoc(ref: DocumentReference<unknown>): Promise<void> {
    return deleteDoc(ref);
  }

  // ===== Storage =====
  storageRef(path: string): StorageReference {
    return storageRef(this.storage, path);
  }

  async uploadBytes(path: string, file: Blob | Uint8Array | ArrayBuffer): Promise<string> {
    const ref = this.storageRef(path);
    const result = await uploadBytes(ref, file);
    return getDownloadURL(result.ref);
  }

  async uploadString(
    path: string,
    data: string,
    format: 'data_url' | 'base64' | 'base64url' | 'raw' = 'data_url'
  ): Promise<string> {
    const ref = this.storageRef(path);
    const result = await uploadString(ref, data, format);
    return getDownloadURL(result.ref);
  }

  // ===== Auth =====
  authState$(): Observable<User | null> {
    return new Observable<User | null>((subscriber) => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (u) => subscriber.next(u),
        (e) => subscriber.error(e)
      );
      return unsubscribe;
    });
  }

  signOut(): Promise<void> {
    return this.auth.signOut();
  }

  deleteCurrentUser(): Promise<void> {
    return this.auth.currentUser
      ? this.auth.currentUser.delete()
      : Promise.resolve();
  }

  signInWithTwitter(): Promise<UserCredential> {
    const provider = new TwitterAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(this.auth, provider);
  }

  getAdditionalUserInfo(credential: UserCredential) {
    return getAdditionalUserInfo(credential);
  }

  // ===== Functions =====
  callFunction<TRequest, TResponse>(
    name: string,
    data: TRequest
  ): Promise<{ data: TResponse }> {
    const callable = httpsCallable<TRequest, TResponse>(this.functions, name);
    return callable(data);
  }

  // ===== Analytics =====
  logEvent(event: string, params?: Record<string, unknown>) {
    logEvent(this.analytics, event as never, params as never);
  }

  setUserId(uid: string | null) {
    setUserId(this.analytics, (uid ?? '') as string);
  }
}
