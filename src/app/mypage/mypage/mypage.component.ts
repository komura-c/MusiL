import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/interfaces/user';
import { Article, ArticleWithAuthor } from 'src/app/interfaces/article';
import { ArticleService } from 'src/app/services/article.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss']
})
export class MypageComponent implements OnInit {
  user$: Observable<UserData>;
  screenName: string;
  articles$: Observable<ArticleWithAuthor[]>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private articleService: ArticleService,
  ) {
    this.route.paramMap.subscribe(params => {
      this.screenName = params.get('id');
      this.user$ = this.userService.getUserByScreenName(
        this.screenName
      );
      let author: UserData;
      this.articles$ = this.user$.pipe(
        map((user: UserData) => {
          author = user;
          return user.uid;
        }),
        switchMap((uid) => {
          return this.articleService.getArticles(uid);
        }),
        map((articles: Article[]) => {
          return articles.map(article => {
            const result: ArticleWithAuthor = {
              ...article,
              author,
            };
            return result;
          });
        })
      );
    });
  }

  ngOnInit(): void {
  }

}
