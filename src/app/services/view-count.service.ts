import { inject, Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { httpsCallable } from '@angular/fire/functions';
import { doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArticleViewCount } from '@interfaces/article-view-count';

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

  getViewCount(articleId: string): Observable<number> {
    const viewCountDocRef = doc(this.firebaseService.firestore, `viewCount/${articleId}`);
    return docData(viewCountDocRef).pipe(
      map((data: ArticleViewCount) => data?.viewCount as number || 0)
    );
  }
}
