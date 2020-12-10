import * as firebase from 'firebase/app';

export interface Article {
  articleId: string;
  uid: string;
  thumbnailURL: string;
  title: string;
  tags: string[];
  text: string;
  isPublic: boolean;
  likeCount: number;
  createdAt: firebase.default.firestore.Timestamp;
  updatedAt: firebase.default.firestore.Timestamp;
}
