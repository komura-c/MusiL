import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SearchGuard  {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    if (next.queryParamMap?.get('q') || next.paramMap?.get('id')) {
      return true;
    } else {
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
