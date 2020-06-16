import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Article } from '../interfaces/article';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  createArticle(article: Article) {
    const id = this.db.createId();
    return this.db.doc(`articles/${id}`).set(article)
      .then(() => {
        this.snackBar.open('記事を投稿しました', null, {
          duration: 2000,
        });
        this.router.navigateByUrl('/');
      });
  }
}
