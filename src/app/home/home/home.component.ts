import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Observable } from 'rxjs';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { tap } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from '@interfaces/user';
import { ScrollService } from 'src/app/services/scroll.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading = true;
  user$: Observable<UserData> = this.authService.user$.pipe(
    tap(() => (this.isLoading = false))
  );

  popularArticles$: Observable<
    ArticleWithAuthor[]
  > = this.articleService.getPopularArticles().pipe(
    tap(() => {
      this.loadingService.toggleLoading(false);
      this.scrollService.restoreScrollPosition('top-page');
    })
  );

  latestArticles$: Observable<
    ArticleWithAuthor[]
  > = this.articleService
    .getLatestArticles()
    .pipe(tap(() => this.loadingService.toggleLoading(false)));

  constructor(
    private articleService: ArticleService,
    private loadingService: LoadingService,
    private scrollService: ScrollService,
    public authService: AuthService,
    private title: Title
  ) {
    this.loadingService.toggleLoading(true);
    this.title.setTitle('MusiL | DTMや作曲の知識記録プラットフォーム');
  }

  login() {
    this.authService.loginProcessing = true;
    this.authService.login().finally(() => {
      this.authService.loginProcessing = false;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.scrollService.saveScrollPosition('top-page');
  }
}
