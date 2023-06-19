import { Article } from './article';
import type { Timestamp } from 'firebase/firestore';

export interface ArticleComment extends Pick<Article, 'articleId' | 'uid'> {
  commentId: string;
  text: string;
  createdAt: Timestamp;
}
