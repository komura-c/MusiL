import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Observable } from 'rxjs';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { tap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from '@interfaces/user';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
})
export class TopComponent implements OnInit {
  user$: Observable<UserData> = this.authService.user$.pipe(
    tap(() => (this.isUserLoading = false))
  );
  isUserLoading: boolean;

  popularArticles$: Observable<
    ArticleWithAuthor[]
  > = this.articleService.getPopularArticles().pipe(
    take(1),
    tap(() => (this.isPopularLoading = false))
  );
  isPopularLoading: boolean;

  latestArticles$: Observable<
    ArticleWithAuthor[]
  > = this.articleService.getLatestArticles().pipe(
    take(1),
    tap(() => (this.isLatestLoading = false))
  );
  isLatestLoading: boolean;

  constructor(
    private articleService: ArticleService,
    private seoService: SeoService,
    public authService: AuthService
  ) {
    this.isUserLoading = true;
    this.isPopularLoading = true;
    this.isLatestLoading = true;
    this.seoService.updateTitleAndMeta({
      title: 'MusiL | DTMや作曲の知識記録プラットフォーム',
      description:
        'MusiLはDTMや作曲をしている人が気軽に記事などを投稿できるコミュニティです。',
      ogType: 'website',
    });
    this.seoService.createLinkTagForCanonicalURL();
  }

  ngOnInit(): void {}
}
