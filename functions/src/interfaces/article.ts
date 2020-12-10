import * as firestore from '@google-cloud/firestore';

export interface Article {
  articleId: string;
  uid: string;
  thumbnailURL: string;
  title: string;
  tags: string[];
  text: string;
  isPublic: boolean;
  likeCount: number;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}
