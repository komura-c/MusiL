import { inject, Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class ViewCountService {
  private readonly functions = inject(Functions);

  countUpArticleView(sendData: { uid: string; articleId: string }): void {
    const callable = httpsCallable(this.functions, 'countUpArticleView');
    callable(sendData);
  }
}
