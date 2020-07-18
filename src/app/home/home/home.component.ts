import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Observable, of, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { UserData } from 'functions/src/interfaces/user';
import { Article } from 'functions/src/interfaces/article';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  articles$: Observable<ArticleWithAuthor[]> = this.getArticlesWithAuthors();

  constructor(
    private articleService: ArticleService,
    private userService: UserService,
  ) { }

  getArticlesWithAuthors(): Observable<ArticleWithAuthor[]> {
    let articles: Article[];

    return this.articleService.getAllArticles().pipe(
      switchMap((docs: Article[]) => {
        articles = docs;

        if (articles.length) {
          const authorIds: string[] = articles.map(post => post.uid);
          const authorUniqueIds: string[] = Array.from(new Set(authorIds));
          return combineLatest(authorUniqueIds.map(uid => {
            return this.userService.getUserData(uid);
          }));
        } else {
          return of([]);
        }
      }),
      map((users: UserData[]) => {
        return articles.map(article => {
          const result: ArticleWithAuthor = {
            ...article,
            author: users.find(user => user.uid === article.uid),
          };
          return result;
        });
      })
    );
  }

  ngOnInit(): void { }
}
