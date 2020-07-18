import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './user.service';
import { switchMap } from 'rxjs/operators';
import { UserData } from 'functions/src/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  afUser$: Observable<User> = this.afAuth.user;
  uid: string;
  user$: Observable<UserData> = this.afAuth.authState.pipe(
    switchMap((afUser) => {
      if (afUser) {
        this.uid = afUser && afUser.uid;
        return this.userService.getUserData(afUser.uid);
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
  ) { }

  login(): Promise<void> {
    const provider = new auth.TwitterAuthProvider();
    return this.afAuth.signInWithPopup(provider)
      .then((userCredential) => {
        const user = userCredential.user;
        const userInfo = userCredential.additionalUserInfo.profile;
        const userInfoObj = JSON.parse(JSON.stringify(userInfo));
        const avatarURL = userInfoObj.profile_image_url_https.replace('_normal', '');
        this.userService.updateUser({
          uid: user.uid,
          userName: userInfoObj.name,
          avatarURL,
          screenName: userInfoObj.screen_name,
          description: userInfoObj.description,
        });
      })
      .catch((error) => {
        this.router.navigateByUrl('/');
        console.log(error.message);
        this.snackBar.open('ログインエラーです。数秒後にもう一度お試しください。', '閉じる', { duration: 5000 });
      });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigateByUrl('/');
      this.snackBar.open('ログアウトしました。', '閉じる', { duration: 5000 });
    });
  }
}
