import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { Article } from '@interfaces/article';
import { UserData } from '@interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckService {
  private readonly firestore = inject(Firestore);

  getUserScreenNameIsNull(): Observable<UserData[]> {
    const usersCollection = collection(
      this.firestore,
      'users'
    ) as CollectionReference<UserData>;
    const usersQuery = query(usersCollection, where('screenName', '==', null));
    return collectionData<UserData>(usersQuery);
  }

  getArticleThumbnailURLIsNull(): Observable<Article[]> {
    const articlesCollection = collection(
      this.firestore,
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
