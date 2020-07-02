import { UserData } from './user';
export interface Article {
  uId: string;
  aId: string;
  imageURL: string;
  title: string;
  tag: string;
  text: string;
}

export interface ArticleWithAuthor extends Article {
  author: UserData;
}
