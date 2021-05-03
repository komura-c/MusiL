import { Component, HostListener } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Observable, of } from 'rxjs';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
})
export class TopComponent {
  latestArticles$: Observable<
    ArticleWithAuthor[]
  > = this.articleService.getLatestArticles().pipe(take(1));

  popularArticles$: Observable<
    ArticleWithAuthor[]
  > = of([]);
  isPopularLoaded: boolean;

  constructor(
    private articleService: ArticleService,
    private seoService: SeoService,
    public authService: AuthService
  ) {
    this.isPopularLoaded = false;
    this.seoService.updateTitleAndMeta({
      title: 'MusiL | DTMや作曲の知識記録プラットフォーム',
      description:
        'MusiLは、DTMや作曲をしている人が気軽に記事などを投稿できるコミュニティです。プラグインの紹介、曲分析など音楽制作に関する知識共有をテーマにしています。',
      ogType: 'website',
    });
    this.seoService.createLinkTagForCanonicalURL();
  }

  @HostListener('window:scroll', ['$event'])
  getPopularArticles() {
    if (this.isPopularLoaded) {
      return;
    }
    this.popularArticles$ = this.articleService.getPopularArticles().pipe(take(1));
    this.isPopularLoaded = true;
  }
}
