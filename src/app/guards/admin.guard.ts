import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.afUser$.pipe(
      switchMap(async (user) => {
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          return idTokenResult.claims.admin;
        }
        return false;
      }),
      tap((isAdmin) => {
        if (!isAdmin) {
          this.router.navigateByUrl('/');
        }
      })
    );
  }
  canLoad(): Observable<boolean> {
    return this.authService.afUser$.pipe(
      switchMap(async (user) => {
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          return idTokenResult.claims.admin;
        }
        return false;
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
