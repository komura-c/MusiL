import { Component, OnInit } from '@angular/core';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-articles',
  templateUrl: './my-articles.component.html',
  styleUrls: ['./my-articles.component.scss'],
})
export class MyArticlesComponent implements OnInit {
  articles$: Observable<ArticleWithAuthor[]> = this.articleService
    .getMyArticlesPublic(this.userService.mypageUser.uid)
    .pipe(
      tap(() => {
        this.isLoading = false;
      }),
      catchError((error) => {
        console.log(error?.message);
        this.isLoading = false;
        return of(null);
      })
    );

  isLoading: boolean;

  constructor(
    private userService: UserService,
    private articleService: ArticleService
  ) {
    this.isLoading = true;
  }

  ngOnInit(): void { }
}
