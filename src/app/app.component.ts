import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dtmplace';
  activatedRouteData: Observable<Data>;

  loading$ = this.loadingService.loading$;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
  ) {
    this.router.events.forEach(event => {
      if ((event instanceof NavigationEnd)) {
        this.activatedRouteData = this.activatedRoute.firstChild.data;
      }
    });
  }
}
