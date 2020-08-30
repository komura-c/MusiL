import { Algolia } from './utils/algolia.function';
import * as functions from 'firebase-functions';

const config = functions.config();
const algolia = new Algolia();

export const createPost = functions
  .region('asia-northeast1')
  .firestore.document('articles/{id}')
  .onCreate((snap) => {
    const data = snap.data();
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
  .onDelete((snap) => {
    const data = snap.data();

    if (data) {
      return algolia.removeRecord(config.algolia.index_name, data.articleId);
    } else {
      return;
    }
  });

export const updatePost = functions
  .region('asia-northeast1')
  .firestore.document('articles/{id}')
  .onUpdate((change) => {
    const data = change.after.data();
    return algolia.saveRecord({
      indexName: config.algolia.index_name,
      largeConcentKey: 'text',
      isUpdate: true,
      idKey: 'articleId',
      data,
    });
  });
