import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserData } from 'functions/src/interfaces/user';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) { }

  getUserData(uid: string): Observable<UserData> {
    return this.db.doc<UserData>(`users/${uid}`).valueChanges();
  }

  getUserByScreenName(screenName: string): Observable<UserData> {
    return this.db
      .collection<UserData>('users', ref => ref.where('screenName', '==', screenName))
      .valueChanges()
      .pipe(
        map(users => {
          if (users.length) {
            return users[0];
          } else {
            return null;
          }
        })
      );
  }

  async createUser(): Promise<void> {
    const provider = new auth.TwitterAuthProvider();
    const userCredential = await this.afAuth.signInWithPopup(provider);
    const { user, additionalUserInfo } = userCredential;
    const userProfObj = JSON.parse(JSON.stringify(additionalUserInfo.profile));
    const userData: UserData = {
      uid: user.uid,
      userName: userProfObj.name,
      avatarURL: userProfObj.profile_image_url_https.replace('_normal', ''),
      screenName: userProfObj.screen_name,
      description: userProfObj.description,
    };
    return this.db.doc<UserData>(`users/${user.uid}`).set(userData);
  }

  async deleteUser(): Promise<void> {
    return (await this.afAuth.currentUser).delete();
  }
}
