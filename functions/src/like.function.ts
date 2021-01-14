import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { shouldEventRun, markEventTried } from './utils/should.util';

const db = admin.firestore();

export const countUpLiked = functions
  .region('asia-northeast1')
  .firestore.document('users/{userId}/likedArticles/{articleId}')
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should: boolean) => {
      if (should) {
        await db
          .doc(`articles/${context.params.articleId}`)
          .update('likeCount', admin.firestore.FieldValue.increment(1));
        return markEventTried(eventId);
      } else {
        return;
      }
    });
  });

export const countDownLiked = functions
  .region('asia-northeast1')
  .firestore.document('users/{userId}/likedArticles/{articleId}')
  .onDelete(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should: boolean) => {
      if (should) {
        await db
          .doc(`articles/${context.params.articleId}`)
          .update('likeCount', admin.firestore.FieldValue.increment(-1));
        return markEventTried(eventId);
      } else {
        return;
      }
    });
  });
