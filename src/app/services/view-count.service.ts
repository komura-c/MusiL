import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ArticleWithAuthor } from '@interfaces/article-with-author';

@Injectable({
  providedIn: 'root',
})
export class ViewCountService {
  constructor(private fns: AngularFireFunctions) {}

  countUpArticleView(sendData: { uid: string; articleId: string }) {
    const callable = this.fns.httpsCallable('countUpArticleView');
    callable(sendData);
  }
}
