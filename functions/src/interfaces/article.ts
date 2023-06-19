import type { Timestamp } from 'firebase/firestore';
import { UserData } from './user';

export interface Article extends Pick<UserData, 'uid'> {
  articleId: string;
  thumbnailURL: string;
  title: string;
  tags: string[];
  text: string;
  isPublic: boolean;
  likeCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
