import * as firebase from 'firebase/app';

export interface ArticleComment {
  articleId: string;
  uid: string;
  commentId: string;
  text: string;
  createdAt: firebase.default.firestore.Timestamp;
}
