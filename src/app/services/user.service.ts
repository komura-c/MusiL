import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserData } from 'functions/src/interfaces/user';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  Firestore,
  getDoc,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly afAuth = inject(Auth);
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);

  private usersCollection = collection(
    this.firestore,
    'users'
  ) as CollectionReference<UserData>;

  getUserData(uid: string): Observable<UserData> {
    const docRef = doc(this.firestore, `users/${uid}`);
    const docSnap = from(getDoc(docRef));
    return docSnap.pipe(
      map((doc) => {
        if (doc.exists()) {
          return doc.data() as UserData;
        }
        return null;
      })
    );
  }

  getUserByScreenName(screenName: string): Observable<UserData> {
    const usersQuery = query<UserData>(
      this.usersCollection,
      where('screenName', '==', screenName)
    );
    return collectionData<UserData>(usersQuery).pipe(
      map((users) => {
        if (users.length) {
          return users[0];
        }
        return null;
      })
    );
  }

  async createUser(uid: string, twitterProfile: any): Promise<void> {
    const userData: UserData = {
      uid,
      userName: twitterProfile.name,
      avatarURL: twitterProfile.profile_image_url_https.replace('_normal', ''),
      screenName: twitterProfile.screen_name,
      description: twitterProfile.description,
    };
    const docRef = doc(this.firestore, `users/${uid}`);
    return await setDoc(docRef, userData);
  }

  async updateUser(
    uid: string,
    twitterProfile: Record<'screen_name', string>
  ): Promise<void> {
    const userData: Pick<UserData, 'screenName'> = {
      screenName: twitterProfile.screen_name,
    };
    const docRef = doc(this.firestore, `users/${uid}`);
    return await updateDoc(docRef, userData);
  }

  async uploadAvatar(uid: string, avatar: string): Promise<void> {
    const time: number = new Date().getTime();
    const storageRef = ref(this.storage, `users/${uid}/avatar/${time}.png`);
    const result = await uploadString(storageRef, avatar, 'data_url');
    const avatarURL = await getDownloadURL(result.ref);
    const docRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(docRef, { avatarURL });
  }

  changeUserData(
    uid: string,
    newUserData: Pick<UserData, 'userName' | 'description'>
  ): Promise<void> {
    const docRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(docRef, newUserData);
  }

  async deleteUser(): Promise<void> {
    return this.afAuth.currentUser.delete();
  }
}
