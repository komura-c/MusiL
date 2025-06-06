import { BehaviorSubject } from 'rxjs';
import { convertToParamMap, ParamMap } from '@angular/router';
import { MockWindowService } from './window.service.mock';
import { MockDocumentService } from './document.service.mock';

export const AuthServiceStub = {
  user$: new BehaviorSubject({ id: 'xxx' }),
  loginProcessing: false,
  login: jasmine.createSpy('login').and.returnValue(Promise.resolve()),
  deleteUser: jasmine
    .createSpy('deleteUser')
    .and.returnValue(Promise.resolve()),
};

export const UserServiceStub = {
  getUsers: jasmine
    .createSpy('getUsers')
    .and.returnValue(new BehaviorSubject([])),
  getUserByScreenName: jasmine
    .createSpy('getUserByScreenName')
    .and.returnValue(new BehaviorSubject({})),
};

export const ArticleServiceStub = {
  getMyArticles: jasmine
    .createSpy('getMyArticles ')
    .and.returnValue(new BehaviorSubject([])),
  getPopularArticles: jasmine
    .createSpy('getPopularArticles ')
    .and.returnValue(new BehaviorSubject([])),
  getMyArticlesPublic: jasmine
    .createSpy('getMyArticlesPublic ')
    .and.returnValue(new BehaviorSubject([])),
  getLatestArticles: jasmine
    .createSpy('getLatestArticles ')
    .and.returnValue(new BehaviorSubject([])),
  getPickUpArticles: jasmine
    .createSpy('getPickUpArticles ')
    .and.returnValue(new BehaviorSubject([])),
  getArticleOnly: jasmine
    .createSpy('getArticleOnly')
    .and.returnValue(new BehaviorSubject({})),
  deleteArticle: jasmine
    .createSpy('deleteArticle')
    .and.returnValue(Promise.resolve()),
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
    .and.returnValue(new BehaviorSubject([])),
  getArticleThumbnailURLIsNull: jasmine
    .createSpy('getArticleThumbnailURLIsNull')
    .and.returnValue(new BehaviorSubject([])),
};

export const ViewCountServiceStub = {
  countUpArticleView: jasmine
    .createSpy('countUpArticleView')
    .and.returnValue(undefined),
  getViewCount: jasmine
    .createSpy('getViewCount')
    .and.returnValue(new BehaviorSubject(0)),
};

export class ActivatedRouteStub {
  private subject = new BehaviorSubject(convertToParamMap(this.testParamMap));
  paramMap = this.subject.asObservable();
  parent: any;

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

export { MockWindowService, MockDocumentService };
