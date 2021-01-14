import * as admin from 'firebase-admin';
import { DocumentData } from '@google-cloud/firestore';
import { ArticleRandom } from '../interfaces/article-random';

const db = admin.firestore();

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
