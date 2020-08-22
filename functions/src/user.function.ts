import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import { UserData } from './interfaces/user'

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

export const deleteUserData = functions.region('asia-northeast1')
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  }).auth.user().onDelete(async user => {
    const firebase_tools = require('firebase-tools');
    await firebase_tools.firestore.delete(`users/${user.uid}`, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: functions.config().fb.token
    });
    await storage.deleteFiles({ directory: `users/${user.uid}` });
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
