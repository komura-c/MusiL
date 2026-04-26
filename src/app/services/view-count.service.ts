import { inject, Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArticleViewCount } from '@interfaces/article-view-count';

@Injectable({
  providedIn: 'root',
})
export class ViewCountService {
  private readonly firebaseService = inject(FirebaseService);

  countUpArticleView(sendData: { uid: string; articleId: string }): void {
    void this.firebaseService.callFunction('countUpArticleView', sendData);
  }

  getViewCount(articleId: string): Observable<number> {
    const viewCountDocRef = this.firebaseService.doc<ArticleViewCount>(
      `viewCount/${articleId}`
    );
    return from(this.firebaseService.getDoc(viewCountDocRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) {
          return 0;
        }
        const viewCountData = docSnap.data();
        return typeof viewCountData?.viewCount === 'number'
          ? viewCountData.viewCount
          : 0;
      })
    );
  }
}
