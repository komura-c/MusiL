import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserData } from '@interfaces/user';
import { FirebaseService } from './firebase.service';
import { CollectionReference, where } from 'firebase/firestore/lite';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly firebaseService = inject(FirebaseService);

  private get usersCollection(): CollectionReference<UserData> {
    try {
      return this.firebaseService.collection<UserData>('users');
    } catch (error) {
      console.debug('Firestore not available:', error);
      return null as any;
    }
  }

  getUserData(uid: string): Observable<UserData> {
    const docRef = this.firebaseService.doc<UserData>(`users/${uid}`);
    return from(this.firebaseService.getDoc(docRef)).pipe(
      map((doc) => {
        if (doc.exists()) {
          return doc.data() as UserData;
        }
        return null;
      })
    );
  }

  getUserByScreenName(screenName: string): Observable<UserData> {
    const usersQuery = this.firebaseService.query(
      this.usersCollection,
      where('screenName', '==', screenName)
    );
    return this.firebaseService.collectionData<UserData>(usersQuery).pipe(
      map((users) => {
        if (users.length) {
          return users[0];
        }
        return null;
      })
    );
  }

  createUser(uid: string, twitterProfile: any): Promise<void> {
    const userData: UserData = {
      uid,
      userName: twitterProfile.name,
      avatarURL: twitterProfile.profile_image_url_https.replace('_normal', ''),
      screenName: twitterProfile.screen_name,
      description: twitterProfile.description,
    };
    const docRef = this.firebaseService.doc<UserData>(`users/${uid}`);
    return this.firebaseService.setDoc(docRef, userData);
  }

  updateUser(
    uid: string,
    twitterProfile: Record<'screen_name', string>
  ): Promise<void> {
    const userData: Pick<UserData, 'screenName'> = {
      screenName: twitterProfile.screen_name,
    };
    const docRef = this.firebaseService.doc<UserData>(`users/${uid}`);
    return this.firebaseService.updateDoc(docRef, userData);
  }

  async uploadAvatar(uid: string, avatar: string): Promise<void> {
    const time: number = new Date().getTime();
    const avatarURL = await this.firebaseService.uploadString(
      `users/${uid}/avatar/${time}.png`,
      avatar,
      'data_url'
    );
    const docRef = this.firebaseService.doc<UserData>(`users/${uid}`);
    return this.firebaseService.updateDoc(docRef, { avatarURL });
  }

  changeUserData(
    uid: string,
    newUserData: Pick<UserData, 'userName' | 'description'>
  ): Promise<void> {
    const docRef = this.firebaseService.doc<UserData>(`users/${uid}`);
    return this.firebaseService.updateDoc(docRef, newUserData);
  }
}
