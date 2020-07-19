import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import { UserData } from './interfaces/user'

admin.initializeApp();
const db = admin.firestore();

export const createUser = functions.region('asia-northeast1').auth.user().onCreate((user) => {
  if (user.displayName && user.photoURL) {
    const sendUserData: Omit<UserData, 'screenName' | 'description'> = {
      uid: user.uid,
      userName: user.displayName,
      avatarURL: user.photoURL?.replace('_normal', '')
    };
    return db.doc(`users/${user.uid}`).set(sendUserData);
  } else {
    return db.doc(`users/${user.uid}`).set({ uid: user.uid });
  }
});
