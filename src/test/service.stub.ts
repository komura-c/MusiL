import { BehaviorSubject } from 'rxjs';
import { convertToParamMap, ParamMap } from '@angular/router';

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

export class ActivatedRouteStub {
  private subject = new BehaviorSubject(convertToParamMap(this.testParamMap));
  paramMap = this.subject.asObservable();

  private _testParamMap!: ParamMap;
  get testParamMap() {
    return this._testParamMap;
  }
  set testParamMap(params: Record<string, any>) {
    this._testParamMap = convertToParamMap(params);
    this.subject.next(this._testParamMap);
  }

  get snapshot() {
    return {
      paramMap: this.testParamMap,
      queryParamMap: this.testParamMap, // 必要に応じてqueryParamsもモックする
    };
  }
}

export const SearchServiceStub = {
  searchArticles: jasmine.createSpy('searchArticles'),
  index: {
    search: jasmine
      .createSpy('search')
      .and.returnValue(Promise.resolve({ hits: [] })),
  },
};

export const AuthStub = {
  onAuthStateChanged: () => new BehaviorSubject(null).asObservable(),
  // 必要に応じて他の Auth のメソッドをモックします
};
