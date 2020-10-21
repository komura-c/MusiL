import { Component, Inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showHeader: boolean;
  showFooter: boolean;

  loading$ = this.loadingService.loading$;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private meta: Meta,
    @Inject(DOCUMENT) private rootDocument: HTMLDocument
  ) {}

  ngOnInit(): void {
    if (!environment.production) {
      this.meta.addTags([
        {
          name: 'robots',
          content: 'noindex',
        },
        {
          name: 'google-site-verification',
          content: 'lphVgz9xigdAZsOmb_GF1_hEhN6TT-yYgE7JysL-21Q',
        },
      ]);
      this.rootDocument
        .querySelector('[rel=icon]')
        .setAttribute('href', 'favicon-dev.svg');
    }
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
