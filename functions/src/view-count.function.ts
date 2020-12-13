import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ArticleViewCount } from './interfaces/article-view-count';

const db = admin.firestore();

export const countUpArticleView = functions
  .region('asia-northeast1')
  .https.onCall(async (data: { uid: string; articleId: string }, context) => {
    const { uid, articleId } = data;
    const viewCountData: ArticleViewCount = {
      uid,
      articleId,
      viewCount: admin.firestore.FieldValue.increment(1),
    };
    return await db
      .doc(`viewCount/${articleId}`)
      .set(viewCountData, { merge: true });
  });
