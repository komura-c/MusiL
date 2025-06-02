import { inject, Injectable } from '@angular/core';
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from '@angular/fire/firestore/lite';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private readonly firebaseService = inject(FirebaseService);

  likeArticle(articleId: string, uid: string): Promise<void> {
    return setDoc(
      doc(
        this.firebaseService.firestore,
        `users/${uid}/likedArticles/${articleId}`
      ),
      {
        articleId,
        updatedAt: Timestamp.now(),
      }
    );
  }

  unLikeArticle(articleId: string, uid: string): Promise<void> {
    return deleteDoc(
      doc(
        this.firebaseService.firestore,
        `users/${uid}/likedArticles/${articleId}`
      )
    );
  }

  isLiked(articleId: string, uid: string): Observable<boolean> {
    const docRef = doc(
      this.firebaseService.firestore,
      `users/${uid}/likedArticles/${articleId}`
    );
    const docSnap = from(getDoc(docRef));
    return docSnap.pipe(
      map((doc) => {
        return doc.exists();
      })
    );
  }
}
