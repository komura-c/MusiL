import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Observable, of } from 'rxjs';
import { ArticleService } from 'src/app/services/article.service';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { UserData } from 'functions/src/interfaces/user';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { Article } from 'functions/src/interfaces/article';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss']
})
export class MypageComponent implements OnInit {
  user$: Observable<UserData>;
  screenName: string;
  articles$: Observable<ArticleWithAuthor[]>;

  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private articleService: ArticleService,
    private loadingService: LoadingService,
  ) {
    this.loadingService.toggleLoading(true);
    this.isLoading = true;
    this.route.paramMap.subscribe(params => {
      this.screenName = params.get('id');
      this.user$ = this.userService.getUserByScreenName(this.screenName).pipe(
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
      let author: UserData;
      this.articles$ = this.user$.pipe(
        map((user: UserData) => {
          author = user;
          return user.uid;
        }),
        switchMap((uid) => {
          return this.articleService.getArticles(uid);
        }),
        map((articles: Article[]) => {
          return articles.map(article => {
            const result: ArticleWithAuthor = {
              ...article,
              author,
            };
            return result;
          });
        })
      );
    });
  }

  stringToLink(description: string): string {
    const linkReg = new RegExp(/(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#]+)/gi);
    const toATag = '<a href=\'$1\' target=\'_blank\'>$1</a>';
    const link = description.replace(linkReg, toATag);
    return link;
  }

  ngOnInit(): void {
  }
}
