import { inject, Injectable } from '@angular/core';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { UserData } from '@interfaces/user';
import { Article } from 'functions/src/interfaces/article';
import { combineLatest, from, Observable, of } from 'rxjs';
import { map, switchMap, take, catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import {
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);
  private readonly userService = inject(UserService);

  private articlesCollection = collection(
    this.firestore,
    'articles'
  ) as CollectionReference<Article>;

  async uploadImage(uid: string, file: File): Promise<string> {
    const time: number = new Date().getTime();
    const storageRef = ref(
      this.storage,
      `users/${uid}/images/${time}_${file.name}`
    );
    const result = await uploadBytes(storageRef, file);
    return await getDownloadURL(result.ref);
  }

  createId() {
    return this.articlesCollection.id;
  }

  createArticle(
    articleId: string,
    article: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >
  ): Promise<void> {
    const resultArticle = {
      articleId,
      ...article,
      likeCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    return setDoc(
      doc(this.articlesCollection, articleId),
      <Article>resultArticle
    );
  }

  updateArticle(
    articleId: string,
    article: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >
  ): Promise<void> {
    const resultArticle = {
      articleId,
      ...article,
      updatedAt: Timestamp.now(),
    };
    return updateDoc(
      doc(this.articlesCollection, articleId),
      <Article>resultArticle
    );
  }

  deleteArticle(articleId: string): Promise<void> {
    return deleteDoc(doc(this.articlesCollection, articleId));
  }

  getMyArticlesPublic(user: UserData): Observable<ArticleWithAuthor[]> {
    const articlesQuery = query<Article>(
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
      this.firestore,
      `users/${uid}/likedArticles`
    ) as CollectionReference<{ articleId: string }>;

    const articlesQuery = query<{ articleId: string }>(
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
          const articlesQuery = query<Article>(
            this.articlesCollection,
            where('articleId', '==', articleIdDoc.articleId),
            where('isPublic', '==', true)
          );
          return collectionData(articlesQuery).pipe(
            take(1),
            map((articles) => (articles.length ? articles[0] : null))
          );
        });
        return combineLatest(articleDocs);
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
    const articlesQuery = query<Article>(
      this.articlesCollection,
      where('uid', '==', uid),
      lastArticle ? startAfter(lastArticle.updatedAt) : null,
      orderBy('updatedAt', 'desc'),
      limit(20)
    );
    const articles$ = collectionData<Article>(articlesQuery);
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
    const docRef = doc(this.firestore, 'articles', articleId);
    const docSnap = getDoc(docRef);
    return from(docSnap).pipe(
      map((doc) => {
        if (doc.exists()) {
          return doc.data() as Article;
        } else {
          return null;
        }
      }),
      catchError((error) => {
        console.error(error.message);
        return of(null);
      })
    );
  }

  getPopularArticles(): Observable<ArticleWithAuthor[]> {
    const articlesQuery = query<Article>(
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
    const articlesQuery = query<Article>(
      this.articlesCollection,
      where('isPublic', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );
    const sorted = collectionData<Article>(articlesQuery);
    return this.getArticlesWithAuthors(sorted);
  }

  getPickUpArticles(): Observable<ArticleWithAuthor[]> {
    const articlesQuery = query<Article>(
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
      map(([article, author]) => {
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
