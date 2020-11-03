import { ArticleComment } from './article-comment';
import { UserData } from './user';

export interface ArticleCommentWithAuthor extends ArticleComment {
  author: UserData;
}
