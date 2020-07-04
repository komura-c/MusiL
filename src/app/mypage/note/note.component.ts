import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleWithAuthor, Article } from 'src/app/interfaces/article';
import { ArticleService } from 'src/app/services/article.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { UserData } from 'src/app/interfaces/user';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  article$: Observable<ArticleWithAuthor>;
  articleId: string;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private userService: UserService,
  ) {
    route.paramMap.subscribe(params => {
      this.articleId = params.get('id');
      const post$ = this.articleService.getArticleByAId(this.articleId);
      let articleData: Article;
      this.article$ = post$.pipe(
        map((article: Article) => {
          articleData = article;
          return article.uId;
        }),
        switchMap((uId: string) => {
          return this.userService.getUserByUId(uId);
        }),
        map((author: UserData) => {
          const result: ArticleWithAuthor = {
            ...articleData,
            author,
          };
          return result;
        })
      );
    });
  }

  ngOnInit(): void {
  }

}
