import { Component, OnInit } from '@angular/core';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
      })
    );

  isLoading = true;

  constructor(
    private userService: UserService,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void { }
}
