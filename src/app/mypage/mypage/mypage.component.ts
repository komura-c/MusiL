import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserData } from 'functions/src/interfaces/user';
import { Observable } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SeoService } from 'src/app/services/seo.service';
import { EncodeUrlPipe } from '../../pipes/encode-url.pipe';
import { StringToLinkPipe } from '../../pipes/string-to-link.pipe';
import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-mypage',
    templateUrl: './mypage.component.html',
    styleUrls: ['./mypage.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatLegacyButtonModule,
        RouterLink,
        MatIconModule,
        MatLegacyTabsModule,
        RouterLinkActive,
        RouterOutlet,
        AsyncPipe,
        StringToLinkPipe,
        EncodeUrlPipe,
    ],
})
export class MypageComponent implements OnInit {
  screenName$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('id'))
  );

  user$: Observable<UserData> = this.screenName$.pipe(
    switchMap((screenName) => {
      return this.userService.getUserByScreenName(screenName).pipe(take(1));
    }),
    tap((user) => {
      if (!user) {
        this.router.navigateByUrl('/');
        return;
      }
      if (user) {
        this.seoService.updateTitleAndMeta({
          title: `${user.userName} | MusiL`,
          description: user.description,
        });
        this.seoService.createLinkTagForCanonicalURL();
      }
    })
  );

  isArticleLoading: boolean;
  isMyArticlesRoute: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private seoService: SeoService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.isMyArticlesRoute =
          this.route.snapshot.firstChild.data.isMyArticlesRoute === true;
      }
    });
  }
}
