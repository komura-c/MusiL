import firebase from 'firebase/compat/app';
import { Article } from './article';

export interface ArticleComment extends Pick<Article, 'articleId' | 'uid'> {
  commentId: string;
  text: string;
  createdAt: firebase.firestore.Timestamp;
}
