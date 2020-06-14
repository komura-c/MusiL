import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  afUser$: Observable<User> = this.afAuth.user;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
  }
  login() {
    this.afAuth.signInWithPopup(
      new auth.TwitterAuthProvider()
    );
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigateByUrl('/');
  }
}
