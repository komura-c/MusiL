import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Observable } from 'rxjs';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { tap } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from '@interfaces/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isProcessing: boolean;
  user$: Observable<UserData> = this.authService.user$;

  articles$: Observable<ArticleWithAuthor[]> = this.articleService.getArticlesWithAuthors().pipe(
    tap(() => this.loadingService.toggleLoading(false))
  );

  constructor(
    private articleService: ArticleService,
    private loadingService: LoadingService,
    private authService: AuthService,
  ) {
    this.loadingService.toggleLoading(true);
  }

  login() {
    this.isProcessing = true;
    this.authService.login().finally(() => {
      this.isProcessing = false;
    });
  }

  ngOnInit(): void { }
}
