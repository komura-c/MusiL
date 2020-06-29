import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './user.service';
import { UserData } from '../interfaces/user';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  afUser$: Observable<User> = this.afAuth.user;
  uId: string;
  user$: Observable<UserData> = this.afAuth.authState.pipe(
    switchMap((afUser) => {
      if (afUser) {
        return this.userService.getUserByUId(afUser.uid);
      } else {
        return of(null);
      }
    })
  );

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
  ) {
    this.afUser$.subscribe(user => {
      this.uId = user && user.uid;
    });
  }

  login(): Promise<void> {
    const provider = new auth.TwitterAuthProvider();
    return this.afAuth.signInWithPopup(provider)
      .then((userCredential) => {
        const user = userCredential.user;
        const userInfo = userCredential.additionalUserInfo.profile;
        const userInfoObj = JSON.parse(JSON.stringify(userInfo));
        const avatarURL = userInfoObj.profile_image_url.replace('_normal', '');
        this.userService.updateUser({
          uId: user.uid,
          uName: userInfoObj.name,
          avatarURL,
          screenName: userInfoObj.screen_name,
          description: userInfoObj.description,
        });
      })
      .catch((error) => {
        this.router.navigateByUrl('/');
        const errorMessage = error.message;
        this.snackBar.open(errorMessage, null, { duration: 2000 });
      });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigateByUrl('/');
      this.snackBar.open('ログアウトしました', null, { duration: 2000 });
    });
  }
}
