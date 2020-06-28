import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Article } from '../interfaces/article';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  createArticle(article: Article) {
    const id = this.db.createId();
    article.id = id;
    return this.db.doc(`articles/${id}`).set(article)
      .then(() => {
        this.router.navigateByUrl('/');
        this.snackBar.open('記事を投稿しました', null, {
          duration: 2000,
        });
      });
  }

  getAllArticles(): Observable<Article[]> {
    return this.db.collection<Article>(`articles`).valueChanges();
  }

  getArticlesByUId(uId: string): Observable<Article[]> {
    return this.db.collection<Article>(`articles`, ref => ref.where('userId', '==', uId))
      .valueChanges();
  }
}
