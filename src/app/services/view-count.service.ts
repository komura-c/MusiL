import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Injectable({
  providedIn: 'root',
})
export class ViewCountService {
  constructor(private fns: AngularFireFunctions) {}

  countUpArticleView(sendData: { uid: string; articleId: string }): void {
    const callable = this.fns.httpsCallable('countUpArticleView');
    callable(sendData).toPromise();
  }
}
