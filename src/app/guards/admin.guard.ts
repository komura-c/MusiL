import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.afUser$.pipe(
      switchMap(async (user) => {
        const idTokenResult = await user.getIdTokenResult();
        return idTokenResult.claims.admin;
      }),
      tap((isAdmin) => {
        if (!isAdmin) {
          this.router.navigateByUrl('/');
        }
      })
    );
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.afUser$.pipe(
      switchMap(async (user) => {
        const idTokenResult = await user.getIdTokenResult();
        return idTokenResult.claims.admin;
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
