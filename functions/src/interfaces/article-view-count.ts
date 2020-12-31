import { Article } from './article';
import firebase from 'firebase/app';

export interface ArticleViewCount extends Pick<Article, 'uid' | 'articleId'> {
  viewCount: number | firebase.firestore.FieldValue;
}
