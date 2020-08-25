import { Component, OnInit } from '@angular/core';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-liked-articles',
  templateUrl: './liked-articles.component.html',
  styleUrls: ['./liked-articles.component.scss'],
})
export class LikedArticlesComponent implements OnInit {
  articles$: Observable<
    ArticleWithAuthor[]
  > = this.articleService
    .getMyLikedArticles(this.userService.mypageUser.uid)
    .pipe(
      take(1),
      tap(() => {
        this.isLoading = false;
      })
    );

  isLoading = true;

  constructor(
    private userService: UserService,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {}
}
