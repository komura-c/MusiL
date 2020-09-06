import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Article } from 'functions/src/interfaces/article';
import { UserData } from 'functions/src/interfaces/user';
import { LoadingService } from 'src/app/services/loading.service';
import { take } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  user$: Observable<UserData> = this.authService.user$;

  lastArticle: Article;
  articles: Article[] = [];
  isLoading: boolean;
  isComplete: boolean;

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private seoService: SeoService
  ) {
    this.isLoading = true;
    this.loadingService.toggleLoading(true);
    this.seoService.setTitleAndMeta({
      title: `記事の管理 | MusiL`,
      description: `自分の記事を管理するページです`,
      ogType: null,
      ogImage: null,
      twitterCard: null,
    });
  }

  getArticles(uid: string) {
    if (this.isComplete) {
      this.isLoading = false;
      this.loadingService.toggleLoading(false);
      return;
    }
    this.articleService
      .getMyArticles(uid, this.lastArticle)
      .pipe(take(1))
      .toPromise().then(({ articles, lastArticle }) => {
        if (articles) {
          if (!articles.length) {
            this.isComplete = true;
            this.isLoading = false;
            this.loadingService.toggleLoading(false);
            return;
          }
          this.lastArticle = lastArticle;
          this.articles.push(...articles);
          this.isLoading = false;
          this.loadingService.toggleLoading(false);
        }
      });
  }

  ngOnInit(): void {
    this.user$.pipe(take(1)).toPromise().then(
      (user) => {
        this.getArticles(user.uid);
      }
    );
  }
}
