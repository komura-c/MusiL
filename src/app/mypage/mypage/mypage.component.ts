import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserData } from 'functions/src/interfaces/user';
import { Observable } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { UserService } from 'src/app/services/user.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
})
export class MypageComponent implements OnInit, OnDestroy {
  screenName$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('id'))
  );

  user$: Observable<UserData> = this.screenName$.pipe(
    tap((screenName) => {
      this.scrollService.restoreScrollPosition(screenName);
    }),
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
    private route: ActivatedRoute,
    private userService: UserService,
    private loadingService: LoadingService,
    private scrollService: ScrollService,
    private seoService: SeoService,
    public authService: AuthService
  ) {
    this.loadingService.toggleLoading(true);
  }

  stringToLink(description: string): string {
    const linkReg = new RegExp(
      /(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#]+)/gi
    );
    const toATag = "<a href='$1' target='_blank'>$1</a>";
    const link = description.replace(linkReg, toATag);
    return link;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.screenName$.toPromise().then((screenName) => {
      this.scrollService.saveScrollPosition(screenName);
    });
  }
}
