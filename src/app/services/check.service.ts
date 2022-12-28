import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Article } from '@interfaces/article';
import { UserData } from '@interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckService {
  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}

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

  getProfile(sendData: any): Promise<string> {
    const callable = this.fns.httpsCallable('getTwitterProfile');
    return callable(sendData).toPromise();
  }
}
