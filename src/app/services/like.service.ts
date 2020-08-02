import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(
    private db: AngularFirestore,
  ) { }

  likeArticle(articleId: string, uid: string): Promise<void> {
    return this.db.doc(`users/${uid}/likedArticles/${articleId}`).set({ articleId });
  }

  unLikeArticle(articleId: string, uid: string): Promise<void> {
    return this.db.doc(`users/${uid}/likedArticles/${articleId}`).delete();
  }

  isLiked(articleId: string, uid: string): Observable<boolean> {
    return this.db.doc(`users/${uid}/likedArticles/${articleId}`).valueChanges()
      .pipe(map((doc) => !!doc));
  }
}
