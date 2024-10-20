import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.afUser$.pipe(
      switchMap((user) => {
        if (user) {
          return from(user.getIdTokenResult()).pipe(
            map((idTokenResult) => idTokenResult.claims['admin'])
          );
        }
        return of(false);
      }),
      tap((isAdmin) => {
        if (!isAdmin) {
          this.router.navigateByUrl('/');
        }
      })
    );
  }

  canLoad() {
    return this.authService.afUser$.pipe(
      switchMap((user) => {
        if (user) {
          return from(user.getIdTokenResult()).pipe(
            map((idTokenResult) => idTokenResult.claims['admin'])
          );
        }
        return of(false);
      }),
      take(1),
      tap((isAdmin) => {
        if (!isAdmin) {
          this.router.navigateByUrl('/');
        }
      })
    );
  }
}
