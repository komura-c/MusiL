import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserData } from 'functions/src/interfaces/user';
import { Observable } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
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
      if (user) {
        this.seoService.setTitleAndMeta({
          title: `${user.userName}(${user.screenName}) | MusiL`,
          description: user.description,
        });
      }
    }),
    tap(() => {
      this.loadingService.toggleLoading(false);
      this.isLoading = false;
    })
  );

  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private loadingService: LoadingService,
    private seoService: SeoService,
    public authService: AuthService
  ) {
    this.loadingService.toggleLoading(true);
    this.isLoading = true;
  }
  ngOnInit(): void { }
}
