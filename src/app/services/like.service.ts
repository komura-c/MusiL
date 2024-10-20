import { inject, Injectable } from '@angular/core';
import {
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  setDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private readonly firestore = inject(Firestore);

  likeArticle(articleId: string, uid: string): Promise<void> {
    return setDoc(
      doc(this.firestore, `users/${uid}/likedArticles/${articleId}`),
      {
        articleId,
        updatedAt: Timestamp.now(),
      }
    );
  }

  unLikeArticle(articleId: string, uid: string): Promise<void> {
    return deleteDoc(
      doc(this.firestore, `users/${uid}/likedArticles/${articleId}`)
    );
  }

  isLiked(articleId: string, uid: string): Observable<boolean> {
    const docRef = doc(
      this.firestore,
      `users/${uid}/likedArticles/${articleId}`
    );
    const docSnap = from(getDoc(docRef));
    return docSnap.pipe(map((doc) => !!doc));
  }
}
