import { UserData } from './user';
import { firestore } from 'firebase';

export interface Article {
  uId: string;
  aId: string;
  imageURL: string;
  title: string;
  tag: string;
  text: string;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}

export interface ArticleWithAuthor extends Article {
  author: UserData;
}
