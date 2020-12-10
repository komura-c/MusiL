import * as firestore from '@google-cloud/firestore';

export interface ArticleComment {
  articleId: string;
  uid: string;
  commentId: string;
  text: string;
  createdAt: firestore.Timestamp;
}
