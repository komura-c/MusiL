import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Article } from '../interfaces/article';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(
    private db: AngularFirestore,
  ) { }

  createArticle(article: Omit<Article, 'aId' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    const aId = this.db.createId();
    return this.db.doc(`articles/${aId}`).set({
      aId,
      ...article,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now()
    });
  }

  getAllArticles(): Observable<Article[]> {
    return this.db.collection<Article>(`articles`).valueChanges();
  }

  getArticlesByUId(uId: string): Observable<Article[]> {
    return this.db.collection<Article>(`articles`, ref => ref.where('uId', '==', uId))
      .valueChanges();
  }

  getArticleByAId(aId: string): Observable<Article> {
    return this.db.doc<Article>(`articles/${aId}`).valueChanges();
  }
}
