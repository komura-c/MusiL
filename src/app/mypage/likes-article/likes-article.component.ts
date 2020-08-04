import { Component, OnInit } from '@angular/core';
import { UserData } from '@interfaces/user';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';
import { Article } from '@interfaces/article';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-likes-article',
  templateUrl: './likes-article.component.html',
  styleUrls: ['./likes-article.component.scss']
})
export class LikesArticleComponent implements OnInit {
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
