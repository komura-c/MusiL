import { Injectable } from '@angular/core';
import { UserData } from '../interfaces/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore,
  ) { }

  getUser(uId: string): Observable<UserData> {
    return this.db.doc<UserData>(`users/${uId}`).valueChanges();
  }

  updateUser(uId: string, uName: string, avatarURL: string, screenName: string): Promise<void> {
    return this.db.doc<UserData>(`users/${uId}`).update(
      {
        uId, uName, avatarURL, screenName
      }
    );
  }

  deleteUser(uId: string): Promise<void> {
    return this.db.doc<UserData>(`users/${uId}`).delete();
  }
}
