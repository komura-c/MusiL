import { Article } from './article';
import { UserData } from './user';

export interface ArticleWithAuthor extends Article {
  author: UserData;
}
