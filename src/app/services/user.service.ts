import { Injectable } from '@angular/core';
import { UserData } from '../interfaces/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore,
  ) { }

  getUserByUId(uId: string): Observable<UserData> {
    return this.db.doc<UserData>(`users/${uId}`).valueChanges();
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
    return this.db.doc<UserData>(`users/${userData.uId}`).update(userData);
  }

  deleteUser(uId: string): Promise<void> {
    return this.db.doc<UserData>(`users/${uId}`).delete();
  }
}
