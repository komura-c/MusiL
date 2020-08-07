import { Component, OnInit } from '@angular/core';
import { UserData } from '@interfaces/user';
import { Observable, of } from 'rxjs';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { ArticleService } from 'src/app/services/article.service';
import { map, tap, catchError } from 'rxjs/operators';
import { Article } from '@interfaces/article';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-article',
  templateUrl: './my-article.component.html',
  styleUrls: ['./my-article.component.scss'],
})
export class MyArticleComponent implements OnInit {
  articles$: Observable<ArticleWithAuthor[]>;

  isLoading: boolean;

  constructor(
    private userService: UserService,
    private articleService: ArticleService
  ) {
    this.isLoading = true;
    this.articles$ = this.articleService
      .getArticles(this.userService.mypageUser.uid)
      .pipe(
        map((articles: Article[]) => {
          return articles.map((article) => {
            const result: ArticleWithAuthor = {
              ...article,
              author: this.userService.mypageUser,
            };
            return result;
          });
        }),
        tap(() => {
          this.isLoading = false;
        }),
        catchError((error) => {
          console.log(error.message);
          this.isLoading = false;
          return of(null);
        })
      );
  }

  ngOnInit(): void {}
}
