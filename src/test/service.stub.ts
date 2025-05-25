import { BehaviorSubject } from 'rxjs';

export const AuthServiceStub = {
  user$: new BehaviorSubject({ id: 'xxx' }),
};

export const UserServiceStub = {
  getUsers: jest.fn().mockReturnValue(new BehaviorSubject({})),
  getUserByScreenName: jest.fn().mockReturnValue(new BehaviorSubject({})),
};

export const ArticleServiceStub = {
  getMyArticles: jest.fn().mockReturnValue(new BehaviorSubject({})),
  getPopularArticles: jest.fn().mockReturnValue(new BehaviorSubject({})),
  getMyArticlesPublic: jest.fn().mockReturnValue(new BehaviorSubject({})),
  getLatestArticles: jest.fn().mockReturnValue(new BehaviorSubject({})),
  getPickUpArticles: jest.fn().mockReturnValue(new BehaviorSubject({})),
};

export const LikeServiceStub = {
  likeArticle: jest.fn().mockReturnValue(new BehaviorSubject({})),
  unLikeArticle: jest.fn().mockReturnValue(new BehaviorSubject({})),
  isLiked: jest.fn().mockReturnValue(new BehaviorSubject({})),
};

export const CommentServiceStub = {
  articleId$: new BehaviorSubject({ id: 'xxx' }),
  allComments$: new BehaviorSubject({ id: 'xxx' }),
};

export const CheckServiceStub = {
  getUserScreenNameIsNull: jest.fn().mockReturnValue(new BehaviorSubject({})),
  getArticleThumbnailURLIsNull: jest.fn().mockReturnValue(new BehaviorSubject({})),
};
