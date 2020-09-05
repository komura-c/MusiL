import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SeoService } from 'src/app/services/seo.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  user$ = this.authService.user$.pipe(tap((user) => {
    if (user) {
      this.isLoggedIn = true;
    }
  }));
  isLoggedIn = false;

  constructor(private seoService: SeoService, public authService: AuthService) {
    const metaTags = {
      title: 'MusiLについて | MusiL',
      description: 'MusiLについて説明するページです',
      ogType: null,
      ogImage: null,
      twitterCard: null,
    };
    this.seoService.setTitleAndMeta(metaTags);
  }

  ngOnInit(): void { }

  login() {
    this.authService.loginProcessing = true;
    this.authService.login().finally(() => {
      this.authService.loginProcessing = false;
    });
  }
}
