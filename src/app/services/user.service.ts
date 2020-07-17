import { Injectable } from '@angular/core';
import { UserData } from '../interfaces/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

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

  updateUser(userData: UserData): Promise<void> {
    return this.db.doc<UserData>(`users/${userData.uid}`).set(userData);
  }

  async deleteUser(): Promise<void> {
    return (await this.afAuth.currentUser).delete();
  }
}
