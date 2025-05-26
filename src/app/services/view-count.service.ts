import { inject, Injectable } from '@angular/core';
import { httpsCallable } from '@angular/fire/functions';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class ViewCountService {
  private readonly firebaseService = inject(FirebaseService);

  countUpArticleView(sendData: { uid: string; articleId: string }): void {
    const callable = httpsCallable(this.firebaseService.functions, 'countUpArticleView');
    callable(sendData);
  }
}
