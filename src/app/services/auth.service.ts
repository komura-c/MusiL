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

  async login(): Promise<void> {
    if (this.afUser$) {
      await this.afAuth.signOut();
    }
    if (this.uid) {
      const provider = new auth.TwitterAuthProvider();
      return await this.afAuth.signInWithPopup(provider)
        .then(() => {
          this.router.navigateByUrl('/');
          this.snackBar.open('ログインしました。', '閉じる', { duration: 5000 });
        })
        .catch((error) => {
          this.router.navigateByUrl('/');
          console.log(error.message);
          this.snackBar.open('ログインエラーです。数秒後にもう一度お試しください。', '閉じる', { duration: 5000 });
        });
    } else {
      return await this.userService.createUser()
        .then(() => {
          this.router.navigateByUrl('/');
          this.snackBar.open('ログインしました。', '閉じる', { duration: 5000 });
        })
        .catch((error) => {
          this.router.navigateByUrl('/');
          console.log(error.message);
          this.snackBar.open('ログインエラーです。数秒後にもう一度お試しください。', '閉じる', { duration: 5000 });
        });
    }
  }

  logout() {
    this.afAuth.signOut()
      .then(() => {
        this.router.navigateByUrl('/');
        this.snackBar.open('ログアウトしました。', '閉じる', { duration: 5000 });
      })
      .catch((error) => {
        this.router.navigateByUrl('/');
        console.log(error.message);
        this.snackBar.open('ログアウトエラーです。数秒後にもう一度お試しください。', '閉じる', { duration: 5000 });
      });
  }
}
