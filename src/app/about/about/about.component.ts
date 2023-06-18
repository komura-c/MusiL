import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SeoService } from 'src/app/services/seo.service';
import { take } from 'rxjs/operators';
import { UserData } from '@interfaces/user';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatLegacyProgressSpinnerModule,
        MatLegacyButtonModule,
        MatIconModule,
        RouterLink,
        MatLegacyCardModule,
    ],
})
export class AboutComponent implements OnInit {
  user: UserData;
  isLoading: boolean;

  constructor(private seoService: SeoService, public authService: AuthService) {
    this.isLoading = true;
    this.seoService.updateTitleAndMeta({
      title: 'MusiLについて | MusiL',
      description: 'MusiLについて説明するページです',
    });
    this.seoService.createLinkTagForCanonicalURL();
  }

  ngOnInit(): void {
    this.authService.user$
      .pipe(take(1))
      .toPromise()
      .then((user) => {
        this.user = user;
        this.isLoading = false;
      });
  }

  login() {
    this.authService.loginProcessing = true;
    this.authService.login().finally(() => {
      this.authService.loginProcessing = false;
    });
  }
}
