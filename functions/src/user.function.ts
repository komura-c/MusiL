import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import { UserData } from './interfaces/user'

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage().bucket();

export const createUser = functions.region('asia-northeast1').auth.user().onCreate((user) => {
  if (user.displayName && user.photoURL) {
    const userData: Omit<UserData, 'screenName' | 'description'> = {
      uid: user.uid,
      userName: user.displayName,
      avatarURL: user.photoURL?.replace('_normal', ''),
    };
    return db.doc(`users/${user.uid}`).set(userData, { merge: true });
  } else {
    return db.doc(`users/${user.uid}`).set({ uid: user.uid }, { merge: true });
  }
});

export const deleteUser = functions.region('asia-northeast1').auth.user()
  .onDelete(async user => {
    const deleteFromFireStore = db.doc(`users/${user.uid}`).delete();
    const deleteFromStorage = storage.deleteFiles({ directory: `users/${user.uid}` });
    return Promise.all([
      deleteFromFireStore,
      deleteFromStorage,
    ]);
  });

export const deleteUserArticles = functions.region('asia-northeast1').auth.user()
  .onDelete(async user => {
    const articles = await db.collection('articles')
      .where('uid', '==', user.uid).get();
    const batch = db.batch();
    articles.forEach((doc) => {
      batch.delete(doc.ref);
    });
    return await batch.commit();
  });
