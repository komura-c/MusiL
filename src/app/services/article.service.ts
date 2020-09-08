import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { UserData } from '@interfaces/user';
import { firestore } from 'firebase/app';
import { Article } from 'functions/src/interfaces/article';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
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
  ) { }
  async uploadImage(uid: string, file: File): Promise<void> {
    const time: number = new Date().getTime();
    const result = await this.storage
      .ref(`users/${uid}/images/${time}_${file.name}`)
      .put(file);
    return await result.ref.getDownloadURL();
  }

  createArticle(
    articleId: string,
    article: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >,
    user: UserData
  ): Promise<void> {
    const resultArticle = {
      articleId,
      ...article,
      likeCount: 0,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
    };
    this.ogpService.createOgpImageAndUpload(resultArticle, user);
    return this.db.doc(`articles/${articleId}`).set(resultArticle);
  }

  updateArticle(
    articleId: string,
    article: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >,
    user: UserData
  ): Promise<void> {
    const resultArticle = {
      articleId,
      ...article,
      updatedAt: firestore.Timestamp.now(),
    };
    this.ogpService.createOgpImageAndUpload(resultArticle, user);
    return this.db.doc(`articles/${articleId}`).update(resultArticle);
  }

  deleteArticle(articleId: string): Promise<void> {
    this.ogpService.deleteOgp(articleId);
    return this.db.doc(`articles/${articleId}`).delete();
  }

  getMyArticlesPublic(user: UserData): Observable<ArticleWithAuthor[]> {
    return this.db
      .collection<Article>(`articles`, (ref) =>
        ref
          .where('uid', '==', user.uid)
          .where('isPublic', '==', true)
          .orderBy('updatedAt', 'desc')
          .limit(20)
      )
      .valueChanges()
      .pipe(
        take(1),
        map((articles: Article[]) => {
          if (articles?.length) {
            return articles.map((article) => {
              const result: ArticleWithAuthor = {
                ...article,
                author: user,
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
        ref.orderBy('updatedAt', 'desc').limit(20)
      )
      .valueChanges()
      .pipe(take(1))
      .pipe(
        switchMap((articleIdDocs: { articleId: string }[]) => {
          if (articleIdDocs?.length) {
            return combineLatest(
              articleIdDocs.map((articleIdDoc) => {
                const articleDocs = this.db
                  .collection<Article>(`articles`, (ref) =>
                    ref
                      .where('articleId', '==', articleIdDoc.articleId)
                      .where('isPublic', '==', true)
                  )
                  .valueChanges();
                return articleDocs.pipe(
                  map((articles) => {
                    if (articles.length) {
                      return articles[0];
                    } else {
                      return null;
                    }
                  })
                );
              })
            );
          } else {
            return of([]);
          }
        }),
        map((articles) => {
          return articles.filter((article) => article);
        })
      );
    return this.getArticlesWithAuthors(sorted);
  }

  getMyArticles(
    uid: string,
    lastArticle?: Article
  ): Observable<{
    articles: Article[];
    lastArticle: Article;
  }> {
    const articles$ = this.db
      .collection<Article>('articles', (ref) => {
        let query = ref
          .where('uid', '==', uid)
          .orderBy('updatedAt', 'desc')
          .limit(20);
        if (lastArticle) {
          query = query.startAfter(lastArticle.updatedAt);
        }
        return query;
      })
      .valueChanges();
    return articles$.pipe(
      map((articles) => {
        return {
          articles,
          lastArticle: articles[articles.length - 1],
        };
      })
    );
  }

  getArticleOnly(articleId: string): Observable<Article> {
    return this.db.doc<Article>(`articles/${articleId}`).valueChanges();
  }

  getPopularArticles(): Observable<ArticleWithAuthor[]> {
    const sorted: Observable<Article[]> = this.db
      .collection<Article>(`articles`, (ref) => {
        return ref
          .where('isPublic', '==', true)
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
        return ref
          .where('isPublic', '==', true)
          .orderBy('updatedAt', 'desc')
          .limit(20);
      })
      .valueChanges();
    return this.getArticlesWithAuthors(sorted);
  }

  getPickUpArticles(
    ramdamDateTimeStamp?: firestore.Timestamp
  ): Observable<ArticleWithAuthor[]> {
    const sorted: Observable<Article[]> = this.db
      .collection<Article>('articles', (ref) => {
        let query = ref
          .where('isPublic', '==', true)
          .orderBy('createdAt', 'desc')
          .limit(10);
        if (ramdamDateTimeStamp) {
          query = query.startAfter(ramdamDateTimeStamp);
        }
        return query;
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

  getArticleWithAuthorByArticleId(
    articleId: string
  ): Observable<ArticleWithAuthor> {
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
