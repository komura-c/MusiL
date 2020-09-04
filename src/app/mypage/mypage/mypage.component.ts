import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { UserData } from 'functions/src/interfaces/user';
import { Observable } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';
import { SeoService } from 'src/app/services/seo.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
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
      if (user) {
        const descriptionMaxLength = 120;
        const description =
          user.description.slice(0, descriptionMaxLength) + '…';
        const metaTags = {
          title: `${user.userName}(${user.screenName}) | MusiL`,
          description,
          ogType: null,
          ogImage: null,
          twitterCard: null,
        };
        this.seoService.setTitleAndMeta(metaTags);
      }
    }),
    tap(() => {
      this.loadingService.toggleLoading(false);
      this.isLoading = false;
    })
  );

  isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private loadingService: LoadingService,
    private seoService: SeoService,
    public authService: AuthService,
    private scrollService: ScrollService,
  ) {
    this.loadingService.toggleLoading(true);
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.scrollService.saveScrollPosition('mypage');
      }
      if (event instanceof NavigationEnd) {
        this.scrollService.restoreScrollPosition('mypage');
      }
    });
  }
  ngOnInit(): void { }
}
