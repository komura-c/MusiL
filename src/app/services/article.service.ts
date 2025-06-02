import { inject, Injectable } from '@angular/core';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { UserData } from '@interfaces/user';
import { Article } from '@interfaces/article';
import { combineLatest, from, Observable, of } from 'rxjs';
import { map, switchMap, take, catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { FirebaseService } from './firebase.service';
import {
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  limit,
  orderBy,
  query,
  QueryConstraint,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore/lite';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly firebaseService = inject(FirebaseService);
  private readonly userService = inject(UserService);

  private articlesCollection = collection(
    this.firebaseService.firestore,
    'articles'
  ) as CollectionReference<Article>;

  async uploadImage(uid: string, file: File): Promise<string> {
    const time: number = new Date().getTime();
    const storageRef = ref(
      this.firebaseService.storage,
      `users/${uid}/images/${time}_${file.name}`
    );
    const result = await uploadBytes(storageRef, file);
    return await getDownloadURL(result.ref);
  }

  async createArticle(
    article: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >
  ): Promise<string> {
    const docRef = doc(this.articlesCollection);
    const articleId = docRef.id;
    const resultArticle = {
      articleId,
      ...article,
      likeCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await setDoc(docRef, <Article>resultArticle);
    return articleId;
  }

  updateArticle(
    articleId: string,
    article: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >
  ): Promise<void> {
    const docRef = doc(this.articlesCollection, articleId);
    const resultArticle = {
      articleId,
      ...article,
      updatedAt: Timestamp.now(),
    };
    return updateDoc(docRef, resultArticle);
  }

  deleteArticle(articleId: string): Promise<void> {
    const docRef = doc(this.articlesCollection, articleId);
    return deleteDoc(docRef);
  }

  getMyArticlesPublic(user: UserData): Observable<ArticleWithAuthor[]> {
    const articlesQuery = query(
      this.articlesCollection,
      where('uid', '==', user.uid),
      where('isPublic', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );
    return collectionData<Article>(articlesQuery).pipe(
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
    const likedArticlesCollection = collection(
      this.firebaseService.firestore,
      `users/${uid}/likedArticles`
    ) as CollectionReference<{ articleId: string }>;

    const articlesQuery = query(
      likedArticlesCollection,
      orderBy('updatedAt', 'desc'),
      limit(20)
    );

    const userlikedArticles = collectionData<{ articleId: string }>(
      articlesQuery
    ).pipe(take(1));

    const sorted = userlikedArticles.pipe(
      switchMap((articleIdDocs: { articleId: string }[]) => {
        const articleDocs = articleIdDocs.map((articleIdDoc) => {
          const articlesQuery = query(
            this.articlesCollection,
            where('articleId', '==', articleIdDoc.articleId),
            where('isPublic', '==', true)
          );
          return collectionData(articlesQuery).pipe(
            take(1),
            map((articles: any[]) => (articles.length ? articles[0] : null))
          );
        });
        return combineLatest(articleDocs);
      }),
      map((articles: any[]) => {
        return articles.filter((article: any) => article);
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
    const articlesQuery = query(this.articlesCollection, ...queryOperator);
    const articles$ = collectionData<Article>(articlesQuery);
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
    const docRef = doc(this.firebaseService.firestore, 'articles', articleId);
    const docSnap = getDoc(docRef);
    return from(docSnap).pipe(
      map((doc: any) => {
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
    const articlesQuery = query(
      this.articlesCollection,
      where('isPublic', '==', true),
      orderBy('likeCount', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const sorted = collectionData<Article>(articlesQuery);
    return this.getArticlesWithAuthors(sorted);
  }

  getLatestArticles(): Observable<ArticleWithAuthor[]> {
    const articlesQuery = query(
      this.articlesCollection,
      where('isPublic', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );
    const sorted = collectionData<Article>(articlesQuery);
    return this.getArticlesWithAuthors(sorted);
  }

  getPickUpArticles(): Observable<ArticleWithAuthor[]> {
    const articlesQuery = query(
      this.articlesCollection,
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const sorted = collectionData<Article>(articlesQuery);
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
