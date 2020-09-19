import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './user.service';
import { switchMap, shareReplay, take } from 'rxjs/operators';
import { UserData } from 'functions/src/interfaces/user';

@Injectable({
  providedIn: 'root',
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
    }),
    shareReplay(1)
  );
  loginProcessing = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) { }

  async login(): Promise<void> {
    this.loginProcessing = true;
    const provider = new auth.TwitterAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await this.afAuth.signInWithPopup(provider);
    const { user, additionalUserInfo } = userCredential;
    const twitterProfile = additionalUserInfo.profile as any;
    this.userService.getUserData(user.uid)
      .pipe(take(1))
      .toPromise()
      .then((userDoc) => {
        if (userDoc?.screenName) {
          this.userService.updateUser(user.uid, twitterProfile)
            .then(() => {
              this.router.navigateByUrl('/');
              this.snackBar.open('ログインしました。', '閉じる');
              this.loginProcessing = false;
            })
            .catch((error) => {
              this.loginProcessing = false;
              console.error(error.message);
              this.snackBar.open(
                'ログインエラーです。数秒後にもう一度お試しください。',
                '閉じる'
              );
            });
        } else {
          this.userService.createUser(user.uid, twitterProfile)
            .then(() => {
              this.router.navigateByUrl('/');
              this.snackBar.open('ログインしました。', '閉じる');
              this.loginProcessing = false;
            })
            .catch((error) => {
              this.loginProcessing = false;
              console.error(error.message);
              this.snackBar.open(
                'ログインエラーです。数秒後にもう一度お試しください。',
                '閉じる'
              );
            });
        }
      });
  }

  async logout(): Promise<void> {
    this.loginProcessing = true;
    return await this.afAuth
      .signOut()
      .then(() => {
        this.router.navigateByUrl('/');
        this.snackBar.open('ログアウトしました。', '閉じる');
        this.loginProcessing = false;
      })
      .catch((error) => {
        this.loginProcessing = false;
        console.error(error.message);
        this.snackBar.open(
          'ログアウトエラーです。数秒後にもう一度お試しください。',
          '閉じる'
        );
      });
  }
}
