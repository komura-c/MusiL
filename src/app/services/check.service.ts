import { inject, Injectable } from '@angular/core';
import { where } from 'firebase/firestore/lite';
import { Article } from '@interfaces/article';
import { UserData } from '@interfaces/user';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class CheckService {
  private readonly firebaseService = inject(FirebaseService);

  getUserScreenNameIsNull(): Observable<UserData[]> {
    const usersCollection = this.firebaseService.collection<UserData>('users');
    const usersQuery = this.firebaseService.query(
      usersCollection,
      where('screenName', '==', null)
    );
    return this.firebaseService.collectionData<UserData>(usersQuery);
  }

  getArticleThumbnailURLIsNull(): Observable<Article[]> {
    const articlesCollection =
      this.firebaseService.collection<Article>('articles');
    const articlesQuery = this.firebaseService.query(
      articlesCollection,
      where('isPublic', '==', true),
      where('thumbnailURL', '==', null)
    );
    return this.firebaseService.collectionData<Article>(articlesQuery);
  }
}
