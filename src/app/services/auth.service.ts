import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { UserService } from './user.service';
import { switchMap, shareReplay, take } from 'rxjs/operators';
import { UserData } from 'functions/src/interfaces/user';
import {
  Auth,
  authState,
  getAdditionalUserInfo,
  signInWithPopup,
  TwitterAuthProvider,
  user,
  User,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly afAuth = inject(Auth);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly userService = inject(UserService);

  readonly afUser$: Observable<User> = user(this.afAuth);
  uid: string;
  user$: Observable<UserData> = authState(this.afAuth).pipe(
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

  async login(): Promise<void> {
    this.loginProcessing = true;
    const provider = new TwitterAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(this.afAuth, provider);
    const user = userCredential.user;
    const additionalUserInfo = getAdditionalUserInfo(userCredential);
    const twitterProfile = additionalUserInfo.profile as Record<
      'screen_name',
      string
    >;
    return this.userService
      .getUserData(user.uid)
      .pipe(take(1))
      .toPromise()
      .then((userDoc) => {
        if (userDoc?.screenName) {
          this.userService
            .updateUser(user.uid, twitterProfile)
            .then(() => {
              this.succeededLogin();
            })
            .catch((error) => {
              this.failedLogin(error);
            });
        } else {
          this.userService
            .createUser(user.uid, twitterProfile)
            .then(() => {
              this.succeededLogin();
            })
            .catch((error) => {
              this.failedLogin(error);
            });
        }
      });
  }

  succeededLogin() {
    this.router.navigateByUrl('/');
    this.snackBar.open('ログインしました。', '閉じる');
    this.loginProcessing = false;
  }

  failedLogin(error: { message: any }) {
    this.loginProcessing = false;
    console.error(error.message);
    this.snackBar.open(
      'ログインエラーです。数秒後にもう一度お試しください。',
      '閉じる'
    );
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

  deleteUser(): Promise<void> {
    return this.afAuth.currentUser.delete();
  }
}
