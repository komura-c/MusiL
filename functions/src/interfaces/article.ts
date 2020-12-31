import firebase from 'firebase/app';
import { UserData } from './user';

export interface Article extends Pick<UserData, 'uid'> {
  articleId: string;
  thumbnailURL: string;
  title: string;
  tags: string[];
  text: string;
  isPublic: boolean;
  likeCount: number;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}
