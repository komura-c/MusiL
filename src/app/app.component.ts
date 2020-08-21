import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showHeader: boolean;
  showFooter: boolean;

  loading$ = this.loadingService.loading$;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader =
          this.route.snapshot.firstChild.data.showHeader !== false;
        this.showFooter =
          this.route.snapshot.firstChild.data.showFooter !== false;
      }
    });
  }
}
