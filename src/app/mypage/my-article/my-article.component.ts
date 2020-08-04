import { Component, OnInit } from '@angular/core';
import { UserData } from '@interfaces/user';
import { Observable, } from 'rxjs';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { ArticleService } from 'src/app/services/article.service';
import { map } from 'rxjs/operators';
import { Article } from '@interfaces/article';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-article',
  templateUrl: './my-article.component.html',
  styleUrls: ['./my-article.component.scss']
})
export class MyArticleComponent implements OnInit {
  articles$: Observable<ArticleWithAuthor[]>;

  constructor(
    private userService: UserService,
    private articleService: ArticleService,
  ) {
    const user: UserData = this.userService.mypageUser;
    this.articles$ = this.articleService.getArticles(user.uid).pipe(
      map((articles: Article[]) => {
        return articles.map(article => {
          const result: ArticleWithAuthor = {
            ...article,
            author: user,
          };
          return result;
        });
      })
    );
  }

  ngOnInit(): void {
  }
}
