import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { firestore } from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';
import { Article } from 'functions/src/interfaces/article';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { switchMap, map } from 'rxjs/operators';
import { UserData } from '@interfaces/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private userService: UserService
  ) {}

  getArticles(uid: string): Observable<Article[]> {
    return this.db
      .collection<Article>(`articles`, (ref) =>
        ref
          .where('uid', '==', uid)
          .where('isPublic', '==', true)
          .orderBy('updatedAt', 'desc')
      )
      .valueChanges();
  }

  getLikedArticles(uid: string): Observable<Article[]> {
    return this.db
      .collection(`users/${uid}/likedArticles`, (ref) =>
        ref.orderBy('updatedAt', 'desc')
      )
      .valueChanges()
      .pipe(
        switchMap((articleIdDocs: { articleId: string }[]) => {
          return combineLatest(
            articleIdDocs.map((articleIdDoc) => {
              return this.db
                .doc<Article>(`articles/${articleIdDoc.articleId}`)
                .valueChanges();
            })
          );
        })
      );
  }

  getMyArticles(uid: string): Observable<Article[]> {
    return this.db
      .collection<Article>(`articles`, (ref) =>
        ref.where('uid', '==', uid).orderBy('updatedAt', 'desc')
      )
      .valueChanges();
  }

  getArticleOnly(articleId: string): Observable<Article> {
    return this.db.doc<Article>(`articles/${articleId}`).valueChanges();
  }

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
    return this.db.doc(`articles/${articleId}`).set({
      articleId,
      ...article,
      likeCount: 0,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
    });
  }

  updateArticle(
    articleId: string,
    likeCount: number,
    article: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >
  ): Promise<void> {
    return this.db.doc(`articles/${articleId}`).update({
      ...article,
      likeCount,
      updatedAt: firestore.Timestamp.now(),
    });
  }

  deleteArticle(articleId: string): Promise<void> {
    return this.db.doc(`articles/${articleId}`).delete();
  }

  getPopularArticles(): Observable<ArticleWithAuthor[]> {
    const sorted = this.db.collection<ArticleWithAuthor>(`articles`, (ref) => {
      return ref.orderBy('likeCount', 'desc').limit(10);
    });
    return this.getArticlesWithAuthors(sorted);
  }

  getLatestArticles(): Observable<ArticleWithAuthor[]> {
    const sorted = this.db.collection<ArticleWithAuthor>(`articles`, (ref) => {
      return ref.orderBy('updatedAt', 'desc').limit(10);
    });
    return this.getArticlesWithAuthors(sorted);
  }

  getArticlesWithAuthors(
    sorted: AngularFirestoreCollection<Article>
  ): Observable<ArticleWithAuthor[]> {
    let articles: Article[];

    return sorted.valueChanges().pipe(
      switchMap((docs: Article[]) => {
        articles = docs;

        if (articles.length) {
          const authorIds: string[] = articles.map((post) => post.uid);
          const authorUniqueIds: string[] = Array.from(new Set(authorIds));
          return combineLatest(
            authorUniqueIds.map((uid) => {
              return this.userService.getUserData(uid);
            })
          );
        } else {
          return of([]);
        }
      }),
      map((users: UserData[]) => {
        return articles.map((article) => {
          const result: ArticleWithAuthor = {
            ...article,
            author: users.find((user) => user.uid === article.uid),
          };
          return result;
        });
      })
    );
  }
}
