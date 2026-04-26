import { inject, Injectable } from '@angular/core';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { UserData } from '@interfaces/user';
import { Article } from '@interfaces/article';
import { combineLatest, from, Observable, of } from 'rxjs';
import { map, switchMap, take, catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { FirebaseService } from './firebase.service';
import {
  CollectionReference,
  limit,
  orderBy,
  QueryConstraint,
  startAfter,
  Timestamp,
  where,
} from 'firebase/firestore/lite';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly firebaseService = inject(FirebaseService);
  private readonly userService = inject(UserService);

  private articlesCollection = this.firebaseService.collection<Article>(
    'articles'
  );

  uploadImage(uid: string, file: File): Promise<string> {
    const time: number = new Date().getTime();
    return this.firebaseService.uploadBytes(
      `users/${uid}/images/${time}_${file.name}`,
      file
    );
  }

  async createArticle(
    article: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >
  ): Promise<string> {
    const docRef = this.firebaseService.doc<Article>(this.articlesCollection);
    const articleId = docRef.id;
    const resultArticle = {
      articleId,
      ...article,
      likeCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await this.firebaseService.setDoc(docRef, <Article>resultArticle);
    return articleId;
  }

  updateArticle(
    articleId: string,
    article: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >
  ): Promise<void> {
    const docRef = this.firebaseService.doc<Article>(
      this.articlesCollection,
      articleId
    );
    const resultArticle = {
      articleId,
      ...article,
      updatedAt: Timestamp.now(),
    };
    return this.firebaseService.updateDoc(docRef, resultArticle);
  }

  deleteArticle(articleId: string): Promise<void> {
    const docRef = this.firebaseService.doc<Article>(
      this.articlesCollection,
      articleId
    );
    return this.firebaseService.deleteDoc(docRef);
  }

  getMyArticlesPublic(user: UserData): Observable<ArticleWithAuthor[]> {
    const articlesQuery = this.firebaseService.query(
      this.articlesCollection,
      where('uid', '==', user.uid),
      where('isPublic', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );
    return this.firebaseService.collectionData<Article>(articlesQuery).pipe(
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
    const likedArticlesCollection = this.firebaseService.collection<{
      articleId: string;
    }>(`users/${uid}/likedArticles`);

    const articlesQuery = this.firebaseService.query(
      likedArticlesCollection,
      orderBy('updatedAt', 'desc'),
      limit(20)
    );

    const userlikedArticles = this.firebaseService
      .collectionData<{ articleId: string }>(articlesQuery)
      .pipe(take(1));

    const sorted = userlikedArticles.pipe(
      switchMap((articleIdDocs: { articleId: string }[]) => {
        const articleDocs = articleIdDocs.map((articleIdDoc) => {
          const q = this.firebaseService.query(
            this.articlesCollection,
            where('articleId', '==', articleIdDoc.articleId),
            where('isPublic', '==', true)
          );
          return this.firebaseService.collectionData<Article>(q).pipe(
            take(1),
            map((articles: Article[]) => (articles.length ? articles[0] : null))
          );
        });
        return combineLatest(articleDocs);
      }),
      map((articles: Article[]) => {
        return articles.filter((article: Article) => article);
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
    const queryOperator: QueryConstraint[] = [
      where('uid', '==', uid),
      orderBy('updatedAt', 'desc'),
      limit(20),
    ];
    if (lastArticle) {
      queryOperator.push(startAfter(lastArticle.updatedAt));
    }
    const articlesQuery = this.firebaseService.query(
      this.articlesCollection,
      ...queryOperator
    );
    const articles$ =
      this.firebaseService.collectionData<Article>(articlesQuery);
    return articles$.pipe(
      map((articles: Article[]) => {
        return {
          articles,
          lastArticle: articles[articles.length - 1],
        };
      })
    );
  }

  getArticleOnly(articleId: string): Observable<Article> {
    const docRef = this.firebaseService.doc<Article>(
      `articles/${articleId}`
    );
    return from(this.firebaseService.getDoc(docRef)).pipe(
      map((doc) => {
        if (doc.exists()) {
          return doc.data() as Article;
        } else {
          return null;
        }
      }),
      catchError((error: any) => {
        console.error(error.message);
        return of(null);
      })
    );
  }

  getPopularArticles(): Observable<ArticleWithAuthor[]> {
    const articlesQuery = this.firebaseService.query(
      this.articlesCollection,
      where('isPublic', '==', true),
      orderBy('likeCount', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const sorted =
      this.firebaseService.collectionData<Article>(articlesQuery);
    return this.getArticlesWithAuthors(sorted);
  }

  getLatestArticles(): Observable<ArticleWithAuthor[]> {
    const articlesQuery = this.firebaseService.query(
      this.articlesCollection,
      where('isPublic', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );
    const sorted =
      this.firebaseService.collectionData<Article>(articlesQuery);
    return this.getArticlesWithAuthors(sorted);
  }

  getPickUpArticles(): Observable<ArticleWithAuthor[]> {
    const articlesQuery = this.firebaseService.query(
      this.articlesCollection,
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const sorted =
      this.firebaseService.collectionData<Article>(articlesQuery);
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

  getArticleWithAuthorByArticleIdAndScreenName(
    articleId: string,
    screenName: string
  ): Observable<ArticleWithAuthor> {
    return this.getArticleOnly(articleId).pipe(
      switchMap((article: Article) => {
        return combineLatest([
          of(article),
          this.userService.getUserData(article?.uid),
        ]);
      }),
      map(([article, author]: [Article, UserData]) => {
        if (article && author && author.screenName === screenName) {
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
