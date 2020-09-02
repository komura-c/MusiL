import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';

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
    private loadingService: LoadingService,
    @Inject(DOCUMENT) private rootDocument: HTMLDocument
  ) {
    this.router.events.forEach((event) => {
      if (!environment.production) {
        this.rootDocument
          .querySelector('[rel=icon]')
          .setAttribute('href', 'favicon-dev.svg');
      }
      if (event instanceof NavigationEnd) {
        this.showHeader =
          this.route.snapshot.firstChild.data.showHeader !== false;
        this.showFooter =
          this.route.snapshot.firstChild.data.showFooter !== false;
      }
    });
  }
}
