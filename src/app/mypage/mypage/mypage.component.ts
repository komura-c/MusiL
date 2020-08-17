import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserData } from 'functions/src/interfaces/user';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss'],
})
export class MypageComponent implements OnInit {
  user$: Observable<UserData>;

  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
    this.loadingService.toggleLoading(true);
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      const screenName = params.get('id');
      this.user$ = this.userService.getUserByScreenName(screenName).pipe(
        tap(() => {
          this.loadingService.toggleLoading(false);
          this.isLoading = false;
        }),
        catchError((error) => {
          console.log(error.message);
          this.loadingService.toggleLoading(false);
          this.isLoading = false;
          return of(null);
        })
      );
    });
  }

  stringToLink(description: string): string {
    const linkReg = new RegExp(
      /(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#]+)/gi
    );
    const toATag = "<a href='$1' target='_blank'>$1</a>";
    const link = description.replace(linkReg, toATag);
    return link;
  }

  isAuthor(uid: string) {
    if (uid === this.authService.uid) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit(): void {}
}
