import { firestore } from 'firebase/app';

export interface Article {
  articleId: string;
  uid: string;
  thumbnailURL: string;
  title: string;
  tags: string[];
  text: string;
  isPublic: boolean;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}
