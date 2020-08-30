import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserData } from 'functions/src/interfaces/user';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  mypageUser: UserData;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {}

  getUserData(uid: string): Observable<UserData> {
    return this.db.doc<UserData>(`users/${uid}`).valueChanges();
  }

  getUserByScreenName(screenName: string): Observable<UserData> {
    return this.db
      .collection<UserData>('users', (ref) =>
        ref.where('screenName', '==', screenName)
      )
      .valueChanges()
      .pipe(
        map((users) => {
          if (users.length) {
            this.mypageUser = users[0];
            return users[0];
          } else {
            return null;
          }
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
    return this.db.doc<UserData>(`users/${uid}`).set(userData);
  }

  async updateUser(uid: string, twitterProfile: any): Promise<void> {
    const userData: Pick<UserData, 'screenName'> = {
      screenName: twitterProfile.screen_name,
    };
    return this.db.doc<UserData>(`users/${uid}`).update(userData);
  }

  async uploadAvatar(uid: string, avatar: string): Promise<void> {
    const time: number = new Date().getTime();
    const result = await this.storage
      .ref(`users/${uid}/avatar/${time}.png`)
      .putString(avatar, 'data_url');
    const avatarURL = await result.ref.getDownloadURL();
    return this.db.doc<UserData>(`users/${uid}`).update({ avatarURL });
  }

  changeUserData(
    uid: string,
    newUserData: Pick<UserData, 'userName' | 'description'>
  ): Promise<void> {
    return this.db.doc<UserData>(`users/${uid}`).update(newUserData);
  }

  async deleteUser(): Promise<void> {
    return (await this.afAuth.currentUser).delete();
  }
}
