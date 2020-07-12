import { UserData } from './user';
import { firestore } from 'firebase/app';

export interface Article {
  articleId: string;
  uid: string;
  thumbnailURL: string;
  title: string;
  tag: string;
  text: string;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}

export interface ArticleWithAuthor extends Article {
  author: UserData;
}
