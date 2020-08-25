import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Article } from 'functions/src/interfaces/article';
import { UserData } from 'functions/src/interfaces/user';
import { LoadingService } from 'src/app/services/loading.service';
import { tap, take } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  uid = this.authService.uid;
  user$: Observable<UserData> = this.authService.user$;
  articles$: Observable<Article[]> = this.articleService
    .getMyArticlesAll(this.uid)
    .pipe(
      take(1),
      tap(() => this.loadingService.toggleLoading(false))
    );

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private seoService: SeoService
  ) {
    const metaTags = {
      title: `記事の管理 | MusiL`,
      description: `自分の記事を管理するページです`,
      ogType: null,
      ogImage: null,
      twitterCard: null,
    };
    this.seoService.setTitleAndMeta(metaTags);
    this.loadingService.toggleLoading(true);
  }

  ngOnInit(): void {}
}
