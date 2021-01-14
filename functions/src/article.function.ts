import { Algolia } from './utils/algolia.util';
import * as functions from 'firebase-functions';
import { htmlToText } from 'html-to-text';
import {
  createArticleRandomAndCountUpTotalArticleCount,
  updateArticleRandom,
  deleteArticleRandomAndCountDownTotalArticleCount,
} from './utils/article-random.util';

const config = functions.config();
const algolia = new Algolia();

export const createPost = functions
  .region('asia-northeast1')
  .firestore.document('articles/{id}')
  .onCreate(async (snap) => {
    const data = snap.data();
    await createArticleRandomAndCountUpTotalArticleCount(data);
    data.text = htmlToText(data.text).replace(
      /(https|http):\/\/firebasestorage\.googleapis\.com(\/.*|\?.*|$)/g,
      ''
    );
    return algolia.saveRecord({
      indexName: config.algolia.index_name,
      largeConcentKey: 'text',
      idKey: 'articleId',
      data,
    });
  });

export const deletePost = functions
  .region('asia-northeast1')
  .firestore.document('articles/{id}')
  .onDelete(async (snap) => {
    const data = snap.data();
    await deleteArticleRandomAndCountDownTotalArticleCount(data);
    if (data) {
      return algolia.removeRecord(config.algolia.index_name, data.articleId);
    } else {
      return;
    }
  });

export const updatePost = functions
  .region('asia-northeast1')
  .firestore.document('articles/{id}')
  .onUpdate(async (change) => {
    const data = change.after.data();
    await updateArticleRandom(data);
    data.text = htmlToText(data.text).replace(
      /(https|http):\/\/firebasestorage\.googleapis\.com(\/.*|\?.*|$)/g,
      ''
    );
    return algolia.saveRecord({
      indexName: config.algolia.index_name,
      largeConcentKey: 'text',
      isUpdate: true,
      idKey: 'articleId',
      data,
    });
  });
