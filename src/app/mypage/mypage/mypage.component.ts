import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/interfaces/user';
import { Article } from 'src/app/interfaces/article';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss']
})
export class MypageComponent implements OnInit {
  user$: Observable<UserData>;
  screenName: string;
  articles$: Observable<Article[]> = this.articleService.getArticle();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private articleService: ArticleService,
  ) {
    route.paramMap.subscribe(params => {
      this.screenName = params.get('id');
      this.user$ = this.userService.getUserByScreenName(
        this.screenName
      );
    });
  }

  ngOnInit(): void {
  }

}
