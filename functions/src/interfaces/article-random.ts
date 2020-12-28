import { Article } from './article';

export interface ArticleRandom extends Pick<Article, 'articleId' | 'isPublic'> {
  randomNumber: number;
  randomCheck: boolean;
}
