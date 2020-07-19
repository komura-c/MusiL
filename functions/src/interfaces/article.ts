import { firestore } from 'firebase';

export interface Article {
  articleId: string;
  uid: string;
  thumbnailURL: string;
  title: string;
  tag: string;
  text: string;
  isPublic: boolean;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}