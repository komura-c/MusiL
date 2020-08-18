import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Observable, of } from 'rxjs';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { tap, catchError } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from '@interfaces/user';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  isProcessing: boolean;
  user$: Observable<UserData> = this.authService.user$.pipe(
    tap(() => (this.isLoading = false))
  );

  popularArticles$: Observable<
    ArticleWithAuthor[]
  > = this.articleService.getPopularArticles().pipe(
    tap(() => {
      this.loadingService.toggleLoading(false);
      this.scrollService.restoreScrollPosition('top-page');
    }),
    catchError((error) => {
      console.log(error.message);
      this.loadingService.toggleLoading(false);
      return of(null);
    })
  );

  latestArticles$: Observable<
    ArticleWithAuthor[]
  > = this.articleService.getLatestArticles().pipe(
    tap(() => this.loadingService.toggleLoading(false)),
    catchError((error) => {
      console.log(error.message);
      this.loadingService.toggleLoading(false);
      return of(null);
    })
  );

  constructor(
    private articleService: ArticleService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private scrollService: ScrollService
  ) {
    this.loadingService.toggleLoading(true);
    this.isLoading = true;
  }

  login() {
    this.isProcessing = true;
    this.authService.login().finally(() => {
      this.isProcessing = false;
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.scrollService.saveScrollPosition('top-page');
  }
}
