import { Article } from './article';
import type { FieldValue } from 'firebase/firestore';

export interface ArticleViewCount extends Pick<Article, 'uid' | 'articleId'> {
  viewCount: number | FieldValue;
}
