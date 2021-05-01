import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ArticleRandom } from './interfaces/article-random';
import { Article } from './interfaces/article';

const db = admin.firestore();

export const createArticleRandomAndCountUp = functions
  .region('asia-northeast1')
  .firestore.document('articles/{id}')
  .onCreate(async (snap) => {
    const article = snap.data() as Article;
    const totalArticleCountData = (
      await db.doc(`appMeta/totalArticleCount`).get()
    )?.data();
    if (totalArticleCountData) {
      const articleRandomDoc: ArticleRandom = {
        articleId: article.articleId,
        isPublic: article.isPublic,
        randomNumber: totalArticleCountData.totalArticleCount,
        randomCheck: false,
      };
      await db
        .doc(`articleRandom/${article.articleId}`)
        .set(articleRandomDoc, { merge: true });
      return await db
        .doc(`appMeta/totalArticleCount`)
        .update('totalArticleCount', admin.firestore.FieldValue.increment(1));
    }
    functions.logger.info('totalArticleCountDataが取得できませんでした');
    return;
  });

export const deleteArticleRandomAndCountDown = functions
  .region('asia-northeast1')
  .firestore.document('articles/{id}')
  .onDelete(async (snap) => {
    const article = snap.data() as Article;
    await db.doc(`articleRandom/${article.articleId}`).delete();
    return await db
      .doc(`appMeta/totalArticleCount`)
      .update('totalArticleCount', admin.firestore.FieldValue.increment(-1));
  });

export const updateArticleRandom = functions
  .region('asia-northeast1')
  .firestore.document('articles/{id}')
  .onUpdate(async (change) => {
    const article = change.after.data() as Article;
    return await db
      .doc(`articleRandom/${article.articleId}`)
      .set({ isPublic: article.isPublic }, { merge: true });
  });
