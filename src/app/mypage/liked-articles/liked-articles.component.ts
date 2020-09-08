import { Component, OnInit } from '@angular/core';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Observable, of } from 'rxjs';
import { tap, take, map, switchMap } from 'rxjs/operators';
import { ArticleService } from 'src/app/services/article.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-liked-articles',
  templateUrl: './liked-articles.component.html',
  styleUrls: ['./liked-articles.component.scss'],
})
export class LikedArticlesComponent implements OnInit {
  screenName$: Observable<string> = this.route.parent.paramMap.pipe(
    map((params) => params.get('id'))
  );

  private user$ = this.screenName$.pipe(
    switchMap((screenName) => {
      return this.userService.getUserByScreenName(screenName).pipe(take(1));
    })
  );

  articles$: Observable<
    ArticleWithAuthor[]
  > = this.user$.pipe(
    switchMap((user) => {
      if (user) {
        return this.articleService.getMyLikedArticles(user.uid).pipe(take(1));
      } else {
        return of(null);
      }
    }),
    take(1),
    tap(() => {
      this.isLoading = false;
    })
  );

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private userService: UserService,
  ) { }

  ngOnInit(): void { }
}
