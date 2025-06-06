import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  query,
  where,
} from '@angular/fire/firestore/lite';
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
    const usersCollection = collection(
      this.firebaseService.firestore,
      'users'
    ) as CollectionReference<UserData>;
    const usersQuery = query(usersCollection, where('screenName', '==', null));
    return collectionData<UserData>(usersQuery);
  }

  getArticleThumbnailURLIsNull(): Observable<Article[]> {
    const articlesCollection = collection(
      this.firebaseService.firestore,
      'articles'
    ) as CollectionReference<Article>;
    const articlesQuery = query(
      articlesCollection,
      where('isPublic', '==', true),
      where('thumbnailURL', '==', null)
    );
    return collectionData<Article>(articlesQuery);
  }
}
