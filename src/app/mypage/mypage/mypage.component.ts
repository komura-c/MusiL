import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UserData } from 'functions/src/interfaces/user';
import { Observable } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SeoService } from 'src/app/services/seo.service';

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
