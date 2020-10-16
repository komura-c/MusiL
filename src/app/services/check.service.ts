import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Article } from '@interfaces/article';
import { UserData } from '@interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckService {
  constructor(
    private db: AngularFirestore,
  ) { }

  getUserScreenNameIsNull(): Observable<UserData[]> {
    return this.db
      .collection<UserData>(`users`, (ref) =>
        ref.where('screenName', '==', null)
      )
      .valueChanges();
  }

  getArticleThumbnailURLIsNull(): Observable<Article[]> {
    return this.db
      .collection<Article>(`articles`, (ref) =>
        ref.where('isPublic', '==', true).where('thumbnailURL', '==', null)
      )
      .valueChanges();
  }
}
