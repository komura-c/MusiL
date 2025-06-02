import { inject, Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class ViewCountService {
  private readonly firebaseService = inject(FirebaseService);

  countUpArticleView(sendData: { uid: string; articleId: string }): void {
    const callable = httpsCallable(
      this.firebaseService.functions,
      'countUpArticleView'
    );
    callable(sendData);
  }
}
