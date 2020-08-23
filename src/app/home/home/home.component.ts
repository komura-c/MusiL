import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Observable } from 'rxjs';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { tap, take } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from '@interfaces/user';
import { ScrollService } from 'src/app/services/scroll.service';
import { SeoService } from 'src/app/services/seo.service';

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
  > = this.articleService
    .getPopularArticles().pipe(
      take(1),
      tap(() => {
        this.loadingService.toggleLoading(false);
        this.scrollService.restoreScrollPosition('top-page');
      })
    );

  latestArticles$: Observable<
    ArticleWithAuthor[]
  > = this.articleService
    .getLatestArticles().pipe(
      take(1),
      tap(() => this.loadingService.toggleLoading(false))
    );

  constructor(
    private articleService: ArticleService,
    private loadingService: LoadingService,
    private scrollService: ScrollService,
    private seoService: SeoService,
    public authService: AuthService,
  ) {
    const metaTags = {
      title: 'MusiL - DTMや作曲の知識記録プラットフォーム',
      description: 'DTMや作曲の知識を記録しよう',
      ogType: 'website',
      ogImage: null,
      twitterCard: null,
    };
    this.seoService.setTitleAndMeta(metaTags);
    this.loadingService.toggleLoading(true);
  }

  login() {
    this.authService.loginProcessing = true;
    this.authService.login().finally(() => {
      this.authService.loginProcessing = false;
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.scrollService.saveScrollPosition('top-page');
  }
}
