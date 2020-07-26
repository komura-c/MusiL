import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { firestore } from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';
import { Article } from 'functions/src/interfaces/article';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { switchMap, map } from 'rxjs/operators';
import { UserData } from '@interfaces/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private userService: UserService,
  ) { }

  getAllArticles(): Observable<Article[]> {
    return this.db.collection<Article>(`articles`, ref => ref.where('isPublic', '==', true)).valueChanges();
  }

  getArticles(uid: string): Observable<Article[]> {
    return this.db.collection<Article>(`articles`, ref => ref.where('uid', '==', uid).where('isPublic', '==', true)).valueChanges();
  }

  getMyArticles(uid: string): Observable<Article[]> {
    return this.db.collection<Article>(`articles`, ref => ref.where('uid', '==', uid)).valueChanges();
  }

  getArticleOnly(articleId: string): Observable<Article> {
    return this.db.doc<Article>(`articles/${articleId}`).valueChanges();
  }

  async uploadImage(uid: string, file: File): Promise<void> {
    const time: number = new Date().getTime();
    const result = await this.storage.ref(`users/${uid}/images/${time}`).put(file);
    return await result.ref.getDownloadURL();
  }

  createArticle(article: Omit<Article, 'articleId' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const articleId = this.db.createId();
    return this.db.doc(`articles/${articleId}`).set({
      articleId,
      ...article,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now()
    });
  }

  updateArticle(articleId: string, article: Omit<Article, 'articleId' | 'createdAt' | 'updatedAt'>): Promise<void> {
    return this.db.doc(`articles/${articleId}`).update({
      ...article,
      updatedAt: firestore.Timestamp.now()
    });
  }

  deleteArticle(articleId: string): Promise<void> {
    return this.db.doc(`articles/${articleId}`).delete();
  }

  getArticlesWithAuthors(): Observable<ArticleWithAuthor[]> {
    let articles: Article[];

    return this.getAllArticles().pipe(
      switchMap((docs: Article[]) => {
        articles = docs;

        if (articles.length) {
          const authorIds: string[] = articles.map(post => post.uid);
          const authorUniqueIds: string[] = Array.from(new Set(authorIds));
          return combineLatest(authorUniqueIds.map(uid => {
            return this.userService.getUserData(uid);
          }));
        } else {
          return of([]);
        }
      }),
      map((users: UserData[]) => {
        return articles.map(article => {
          const result: ArticleWithAuthor = {
            ...article,
            author: users.find(user => user.uid === article.uid),
          };
          return result;
        });
      }),
    );
  }
}
