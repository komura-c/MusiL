import { Component, OnInit } from '@angular/core';
import { UserData } from '@interfaces/user';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Observable, of, combineLatest } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { Article } from '@interfaces/article';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-likes-article',
  templateUrl: './likes-article.component.html',
  styleUrls: ['./likes-article.component.scss'],
})
export class LikesArticleComponent implements OnInit {
  articles$: Observable<ArticleWithAuthor[]>;

  isLoading: boolean;

  constructor(
    private userService: UserService,
    private articleService: ArticleService
  ) {
    this.isLoading = true;
    let articles: Article[];
    this.articles$ = this.articleService
      .getLikedArticles(this.userService.mypageUser.uid)
      .pipe(
        switchMap((docs: Article[]) => {
          articles = docs;
          if (articles.length) {
            const authorIds: string[] = articles.map((post) => post.uid);
            const authorUniqueIds: string[] = Array.from(new Set(authorIds));
            return combineLatest(
              authorUniqueIds.map((uid) => {
                return this.userService.getUserData(uid);
              })
            );
          } else {
            return of([]);
          }
        }),
        map((users: UserData[]) => {
          return articles.map((article) => {
            const result: ArticleWithAuthor = {
              ...article,
              author: users.find((user) => user.uid === article.uid),
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
