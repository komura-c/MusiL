import { Component, Inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { DOCUMENT, Location, NgIf, AsyncPipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Meta } from '@angular/platform-browser';
import { FooterComponent } from './components/footer/footer.component';
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    HeaderComponent,
    RouterOutlet,
    MatLegacyProgressSpinnerModule,
    FooterComponent,
    AsyncPipe,
  ],
})
export class AppComponent implements OnInit {
  isShowHeader = true;
  isShowFooter = true;
  isScrollContainer = false;

  loading$ = this.loadingService.loading$;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private meta: Meta,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private location: Location
  ) {}

  ngOnInit(): void {
    // PWA用のserviceWorkerが登録されていれば削除
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        if (registrations.length) {
          for (const registration of registrations) {
            registration.unregister();
          }
        }
      });
    }
    // iOSのAutoZoom対策
    const ua = window.navigator.userAgent.toLowerCase();
    const isiOS = ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1;
    if (isiOS) {
      const viewport = this.document.querySelector('meta[name="viewport"]');
      if (viewport) {
        const viewportContent = viewport.getAttribute('content');
        viewport.setAttribute(
          'content',
          viewportContent + ', user-scalable=no'
        );
      }
    }
    if (!environment.production) {
      this.meta.addTag({
        name: 'robots',
        content: 'noindex',
      });
      this.document
        .querySelector('[rel=icon]')
        ?.setAttribute('href', 'favicon-dev.svg');
    }
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        const currentPath = this.location.path();
        if (
          /(\/articles\/create)|(\/articles\/[\u\l\d]+\/edit)/.test(currentPath)
        ) {
          this.isShowHeader = false;
          this.isShowFooter = false;
          this.isScrollContainer = true;
        } else if (/(\/articles)/.test(currentPath)) {
          this.isShowHeader = true;
          this.isShowFooter = false;
          this.isScrollContainer = false;
        } else {
          this.isShowHeader = true;
          this.isShowFooter = true;
          this.isScrollContainer = false;
        }
      }
    });
  }
}
