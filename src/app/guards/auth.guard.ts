import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.afUser$.pipe(
      map(user => !!user),
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigateByUrl('/');
        }
      })
    );
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.afUser$.pipe(
      map(user => !!user),
      take(1),
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigateByUrl('/');
        }
      })
    );
  }
}
