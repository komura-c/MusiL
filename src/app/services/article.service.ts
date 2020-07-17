import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Article } from '../interfaces/article';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
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
}
