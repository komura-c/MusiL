import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DocumentData } from '@google-cloud/firestore';
import { ArticleRandom } from './interfaces/article-random';

const config = functions.config();
const db = admin.firestore();

export const initRandomArticle = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res: any) => {
    if (req.query.access_token_key === config.twitter_bot.access_token_key) {
      const resultData = await initArticleRandomAndTotalArticleCount();
      return res.status(200).send(resultData);
    }
    res.status(404).send("Forbidden you don't have permission");
  });

async function initArticleRandomAndTotalArticleCount(): Promise<boolean> {
  const articlesQuerySnapshot = await db.collection(`articles`).get();
  if (articlesQuerySnapshot) {
    const totalArticleCount = articlesQuerySnapshot.size;
    await db.doc(`appMeta/totalArticleCount`).set({ totalArticleCount });
    const batch = db.batch();
    const articles: DocumentData[] = [];
    articlesQuerySnapshot.forEach((articleQuerySnapshot) => {
      articles.push(articleQuerySnapshot.data());
    });
    articles.forEach((article, index) => {
      const articleRandomRef = db.doc(`articleRandom/${article.articleId}`);
      const articleRandomDoc: ArticleRandom = {
        articleId: article.articleId,
        isPublic: article.isPublic,
        randomNumber: index,
        randomCheck: false,
      };
      batch.set(articleRandomRef, articleRandomDoc, { merge: true });
    });
    await batch.commit();
    return true;
  } else {
    throw new Error('記事データの取得に失敗しました');
  }
}

export async function getTotalArticleCount(): Promise<
  DocumentData | undefined
> {
  return (await db.doc(`appMeta/totalArticleCount`).get())?.data();
}

export async function createArticleRandomAndCountUpTotalArticleCount(
  article: DocumentData
): Promise<void> {
  const totalArticleCountData = await getTotalArticleCount();
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
    await db
      .doc(`appMeta/totalArticleCount`)
      .update('totalArticleCount', admin.firestore.FieldValue.increment(1));
  }
}

export async function deleteArticleRandomAndCountDownTotalArticleCount(
  article: DocumentData
): Promise<void> {
  await db.doc(`articleRandom/${article.articleId}`).delete();
  await db
    .doc(`appMeta/totalArticleCount`)
    .update('totalArticleCount', admin.firestore.FieldValue.increment(-1));
}

export async function updateArticleRandom(
  article: DocumentData
): Promise<void> {
  await db
    .doc(`articleRandom/${article.articleId}`)
    .update({ isPublic: article.isPublic });
}
