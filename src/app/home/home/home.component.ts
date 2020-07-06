import { Component, OnInit } from '@angular/core';
import { Article, ArticleWithAuthor } from 'src/app/interfaces/article';
import { UserData } from 'src/app/interfaces/user';
import { ArticleService } from 'src/app/services/article.service';
import { Observable, of, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

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
          const authorIds: string[] = articles.filter((article, index, self) => {
            return self.findIndex(item => article.uid === item.uid) === index;
          }).map(post => post.uid);
          return combineLatest(authorIds.map(uid => {
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
