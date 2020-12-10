import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Article } from './interfaces/article';
import * as firestore from '@google-cloud/firestore';

const db = admin.firestore();

export const countUpArticleView = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const { uid, articleId }: Pick<Article, 'uid' | 'articleId'> = data;
    const viewCountData: Pick<Article, 'uid' | 'articleId'> & {
      viewCount: number | firestore.FieldValue;
    } = {
      uid,
      articleId,
      viewCount: admin.firestore.FieldValue.increment(1),
    };
    return await db
      .doc(`viewCount/${articleId}`)
      .set(viewCountData, { merge: true });
  });
