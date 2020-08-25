import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { UserData } from '@interfaces/user';
import { firestore } from 'firebase/app';
import { Article } from 'functions/src/interfaces/article';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { OgpService } from './ogp.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private userService: UserService,
    private ogpService: OgpService
  ) {}
  snapArticleId: string;

  async uploadImage(uid: string, file: File): Promise<void> {
    const time: number = new Date().getTime();
    const result = await this.storage
      .ref(`users/${uid}/images/${time}`)
      .put(file);
    return await result.ref.getDownloadURL();
  }

  createArticle(
    article: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >
  ): Promise<void> {
    const articleId = this.db.createId();
    this.snapArticleId = articleId;
    const resultArticle = {
      articleId,
      ...article,
      likeCount: 0,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
    };
    this.ogpService.createOgpImageAndUpload(resultArticle);
    return this.db.doc(`articles/${articleId}`).set(resultArticle);
  }

  updateArticle(
    articleId: string,
    article: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >
  ): Promise<void> {
    this.snapArticleId = articleId;
    const resultArticle = {
      articleId,
      ...article,
      updatedAt: firestore.Timestamp.now(),
    };
    this.ogpService.createOgpImageAndUpload(resultArticle);
    return this.db.doc(`articles/${articleId}`).update(resultArticle);
  }

  deleteArticle(articleId: string): Promise<void> {
    this.ogpService.deleteOgp(articleId);
    return this.db.doc(`articles/${articleId}`).delete();
  }

  getMyArticlesPublic(uid: string): Observable<ArticleWithAuthor[]> {
    return this.db
      .collection<Article>(`articles`, (ref) =>
        ref
          .where('uid', '==', uid)
          .where('isPublic', '==', true)
          .orderBy('updatedAt', 'desc')
      )
      .valueChanges()
      .pipe(
        map((articles: Article[]) => {
          if (articles?.length) {
            return articles.map((article) => {
              const result: ArticleWithAuthor = {
                ...article,
                author: this.userService.mypageUser,
              };
              return result;
            });
          } else {
            return null;
          }
        })
      );
  }

  getMyLikedArticles(uid: string): Observable<ArticleWithAuthor[]> {
    const sorted = this.db
      .collection(`users/${uid}/likedArticles`, (ref) =>
        ref.orderBy('updatedAt', 'desc')
      )
      .valueChanges()
      .pipe(
        switchMap((articleIdDocs: { articleId: string }[]) => {
          if (articleIdDocs?.length) {
            return combineLatest(
              articleIdDocs.map((articleIdDoc) => {
                return this.db
                  .doc<Article>(`articles/${articleIdDoc.articleId}`)
                  .valueChanges();
              })
            );
          } else {
            return of([]);
          }
        })
      );
    return this.getArticlesWithAuthors(sorted);
  }

  getMyArticlesAll(uid: string): Observable<Article[]> {
    return this.db
      .collection<Article>(`articles`, (ref) =>
        ref.where('uid', '==', uid).orderBy('updatedAt', 'desc')
      )
      .valueChanges();
  }

  getArticleOnly(articleId: string): Observable<Article> {
    return this.db.doc<Article>(`articles/${articleId}`).valueChanges();
  }

  getPopularArticles(): Observable<ArticleWithAuthor[]> {
    const sorted: Observable<Article[]> = this.db
      .collection<Article>(`articles`, (ref) => {
        return ref
          .orderBy('likeCount', 'desc')
          .orderBy('updatedAt', 'desc')
          .limit(20);
      })
      .valueChanges();
    return this.getArticlesWithAuthors(sorted);
  }

  getLatestArticles(): Observable<ArticleWithAuthor[]> {
    const sorted: Observable<Article[]> = this.db
      .collection<Article>(`articles`, (ref) => {
        return ref.orderBy('updatedAt', 'desc').limit(20);
      })
      .valueChanges();
    return this.getArticlesWithAuthors(sorted);
  }

  getArticlesWithAuthors(
    sorted: Observable<Article[]>
  ): Observable<ArticleWithAuthor[]> {
    let articles: Article[];
    return sorted.pipe(
      switchMap((docs: Article[]) => {
        if (docs?.length) {
          articles = docs;
          const authorIds: string[] = docs.map((post) => post.uid);
          const authorUniqueIds: string[] = Array.from(new Set(authorIds));
          return combineLatest(
            authorUniqueIds.map((userId) => {
              return this.userService.getUserData(userId);
            })
          );
        } else {
          return of([]);
        }
      }),
      map((users: UserData[]) => {
        if (articles?.length) {
          return articles.map((article: Article) => {
            const result: ArticleWithAuthor = {
              ...article,
              author: users?.find((user: UserData) => user.uid === article.uid),
            };
            return result;
          });
        } else {
          return null;
        }
      })
    );
  }

  getArticleWithAuthorOnly(articleId: string): Observable<ArticleWithAuthor> {
    return this.getArticleOnly(articleId).pipe(
      switchMap((article: Article) => {
        return combineLatest([
          of(article),
          this.userService.getUserData(article?.uid),
        ]);
      }),
      map(([article, author]) => {
        if (article && author) {
          const result: ArticleWithAuthor = {
            ...article,
            author,
          };
          return result;
        } else {
          return null;
        }
      })
    );
  }
}
