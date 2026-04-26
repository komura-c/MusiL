import { inject, Injectable } from '@angular/core';
import { Timestamp } from 'firebase/firestore/lite';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private readonly firebaseService = inject(FirebaseService);

  likeArticle(articleId: string, uid: string): Promise<void> {
    const ref = this.firebaseService.doc<{
      articleId: string;
      updatedAt: Timestamp;
    }>(`users/${uid}/likedArticles/${articleId}`);
    return this.firebaseService.setDoc(ref, {
      articleId,
      updatedAt: Timestamp.now(),
    });
  }

  unLikeArticle(articleId: string, uid: string): Promise<void> {
    const ref = this.firebaseService.doc(
      `users/${uid}/likedArticles/${articleId}`
    );
    return this.firebaseService.deleteDoc(ref);
  }

  isLiked(articleId: string, uid: string): Observable<boolean> {
    const docRef = this.firebaseService.doc(
      `users/${uid}/likedArticles/${articleId}`
    );
    return from(this.firebaseService.getDoc(docRef)).pipe(
      map((doc) => doc.exists())
    );
  }
}
