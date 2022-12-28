import { Article } from './article';
import firebase from 'firebase/compat/app';

export interface ArticleViewCount extends Pick<Article, 'uid' | 'articleId'> {
  viewCount: number | firebase.firestore.FieldValue;
}
