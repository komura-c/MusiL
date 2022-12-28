import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const incrementArticleCount = functions
  .region('asia-northeast1')
  .firestore.document('articles/{id}')
  .onCreate(async () => {
    const totalArticleCountData = (
      await db.doc(`appMeta/totalArticleCount`).get()
    )?.data();
    if (totalArticleCountData) {
      return await db
        .doc(`appMeta/totalArticleCount`)
        .update('totalArticleCount', admin.firestore.FieldValue.increment(1));
    }
    functions.logger.info('totalArticleCountDataが取得できませんでした');
    return;
  });

export const decrementArticleCount = functions
  .region('asia-northeast1')
  .firestore.document('articles/{id}')
  .onDelete(async () => {
    return await db
      .doc(`appMeta/totalArticleCount`)
      .update('totalArticleCount', admin.firestore.FieldValue.increment(-1));
  });
