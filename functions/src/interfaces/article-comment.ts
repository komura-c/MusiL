import { firestore } from 'firebase/app';

export interface ArticleComment {
  articleId: string;
  uid: string;
  commentId: string;
  text: string;
  createdAt: firestore.Timestamp;
}
