import { BehaviorSubject } from 'rxjs';

export const AuthServiceStub = {
  user$: new BehaviorSubject({ id: 'xxx' }),
};

export const UserServiceStub = {
  getUsers: jasmine
    .createSpy('getUsers')
    .and.returnValue(new BehaviorSubject({})),
  getUserByScreenName: jasmine
    .createSpy('getUserByScreenName')
    .and.returnValue(new BehaviorSubject({})),
};

export const ArticleServiceStub = {
  getMyArticles: jasmine
    .createSpy('getMyArticles ')
    .and.returnValue(new BehaviorSubject({})),
  getPopularArticles: jasmine
    .createSpy('getPopularArticles ')
    .and.returnValue(new BehaviorSubject({})),
  getMyArticlesPublic: jasmine
    .createSpy('getMyArticlesPublic ')
    .and.returnValue(new BehaviorSubject({})),
  getLatestArticles: jasmine
    .createSpy('getLatestArticles ')
    .and.returnValue(new BehaviorSubject({})),
  getPickUpArticles: jasmine
    .createSpy('getPickUpArticles ')
    .and.returnValue(new BehaviorSubject({})),
};

export const LikeServiceStub = {
  likeArticle: jasmine
    .createSpy('likeArticle')
    .and.returnValue(new BehaviorSubject({})),
  unLikeArticle: jasmine
    .createSpy('unLikeArticle')
    .and.returnValue(new BehaviorSubject({})),
  isLiked: jasmine
    .createSpy('isLiked')
    .and.returnValue(new BehaviorSubject({})),
};

export const CommentServiceStub = {
  articleId$: new BehaviorSubject({ id: 'xxx' }),
  allComments$: new BehaviorSubject({ id: 'xxx' }),
};

export const CheckServiceStub = {
  getUserScreenNameIsNull: jasmine
    .createSpy('getUserScreenNameIsNull')
    .and.returnValue(new BehaviorSubject({})),
  getArticleThumbnailURLIsNull: jasmine
    .createSpy('getArticleThumbnailURLIsNull')
    .and.returnValue(new BehaviorSubject({})),
};
