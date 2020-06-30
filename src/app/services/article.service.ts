import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Article } from '../interfaces/article';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(
    private db: AngularFirestore,
  ) { }

  createArticle(article: Article): Promise<void> {
    return this.db.doc(`articles/${article.aId}`).set(article);
  }

  getAllArticles(): Observable<Article[]> {
    return this.db.collection<Article>(`articles`).valueChanges();
  }

  getArticlesByUId(uId: string): Observable<Article[]> {
    return this.db.collection<Article>(`articles`, ref => ref.where('userId', '==', uId))
      .valueChanges();
  }
}
