import { Component, HostListener, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { LikeService } from 'src/app/services/like.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import {
  DOCUMENT,
  Location,
  NgIf,
  NgFor,
  AsyncPipe,
  DatePipe,
} from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { ScrollService } from 'src/app/services/scroll.service';
import { SeoService } from 'src/app/services/seo.service';
import { environment } from 'src/environments/environment';
import { LoginDialogComponent } from 'src/app/shared-login-dialog/login-dialog/login-dialog.component';
import {
  MatLegacyDialogModule,
  MatLegacyDialog as MatDialog,
} from '@angular/material/legacy-dialog';
import { ViewCountService } from 'src/app/services/view-count.service';
import { SafeHTMLPipe } from '../../pipes/safe-html.pipe';
import { EncodeUrlPipe } from '../../pipes/encode-url.pipe';
import { StringToLinkPipe } from '../../pipes/string-to-link.pipe';
import { RecommendArticleComponent } from '../../mypage/recommend-article/recommend-article.component';
import { ArticleCommentComponent } from '../../mypage/article-comment/article-comment.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { ArticleEditButtonsComponent } from '../../shared-article-edit/article-edit-buttons/article-edit-buttons.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    MatIconModule,
    RouterLink,
    ArticleEditButtonsComponent,
    MatLegacyChipsModule,
    NgFor,
    MatDividerModule,
    ArticleCommentComponent,
    RecommendArticleComponent,
    AsyncPipe,
    DatePipe,
    StringToLinkPipe,
    EncodeUrlPipe,
    SafeHTMLPipe,
    MatLegacyDialogModule,
  ],
})
export default class ArticleDetailComponent implements OnDestroy {
  private screenName$: Observable<string> = this.route.parent.paramMap.pipe(
    map((params) => {
      return params.get('id');
    })
  );
  articleId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => {
      this.articleId = params.get('id');
      return params.get('id');
    })
  );
  private articleId: string;
  private screenNameAndArticle$ = combineLatest([
    this.screenName$,
    this.articleId$,
  ]);
  article$: Observable<ArticleWithAuthor> = this.screenNameAndArticle$.pipe(
    switchMap(([screenName, articleId]) => {
      return this.articleService
        .getArticleWithAuthorByArticleIdAndScreenName(articleId, screenName)
        .pipe(take(1));
    }),
    tap((article: ArticleWithAuthor) => {
      if (!article) {
        this.router.navigateByUrl('/');
        return;
      }
      if (article) {
        this.initLikeStatus(article);
        this.seoService.updateTitleAndMeta({
          title: `${article.title}`,
          description: article.text,
        });
        this.seoService.createLinkTagForCanonicalURL();
        this.countUpArticleView(article);
      }
    }),
    tap(() => {
      this.getHeading();
      this.scrollService.restoreScrollPosition(this.articleId);
    })
  );

  activeHeadingIndex: number;
  headingPositions: number[] = [];
  headingElements: Element[] = [];
  headerHeight = 70;

  likeCount: number;
  isLiked: boolean;

  projectURL = environment.hostingURL;
  path: string = this.location.path();

  isTocLoaded: boolean;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private likeService: LikeService,
    private snackBar: MatSnackBar,
    private location: Location,
    private clipboard: Clipboard,
    private seoService: SeoService,
    private scrollService: ScrollService,
    public authService: AuthService,
    private dialog: MatDialog,
    private viewCountService: ViewCountService,
    private router: Router,
    @Inject(DOCUMENT) private document: HTMLDocument
  ) {
    this.isTocLoaded = false;
  }

  ngOnDestroy(): void {
    this.scrollService.saveScrollPosition(this.articleId);
  }

  private countUpArticleView(article: ArticleWithAuthor) {
    const timeOnPage = 10000;
    const { uid, articleId } = article;
    setTimeout(() => {
      this.viewCountService.countUpArticleView({ uid, articleId });
    }, timeOnPage);
  }

  private initLikeStatus(article: ArticleWithAuthor) {
    this.likeCount = article.likeCount;
    this.likeService
      .isLiked(article.articleId, this.authService.uid)
      .pipe(take(1))
      .toPromise()
      .then((result) => {
        this.isLiked = result;
      });
  }

  @HostListener('window:scroll', ['$event'])
  getTableOfContents() {
    if (this.isTocLoaded) {
      return;
    }
    if (this.headingPositions.length) {
      const buffer = 20;
      const position = window.pageYOffset + this.headerHeight + buffer;
      this.headingPositions.forEach((headingPosition, index) => {
        if (headingPosition < position) {
          this.activeHeadingIndex = index;
        }
      });
      this.isTocLoaded = true;
    }
    return;
  }

  private getHeading() {
    this.headingElements = [];
    setTimeout(() => {
      const headingTagElements = this.document.querySelectorAll(
        '.article-content h1, .article-content h2, .article-content h3, .article-content h4'
      );
      headingTagElements.forEach((headingTagElement, index) => {
        headingTagElement.id = 'chapter-' + index;
        this.headingElements.push(headingTagElement);
        this.headingPositions.push(
          headingTagElement.getBoundingClientRect().top
        );
      });
    }, 100);
  }

  scrollToHeading(event: MouseEvent) {
    const id = (event.target as EventTarget & { hash: string }).hash.replace(
      '#',
      ''
    );
    if (id !== '') {
      const rectTop = this.document
        .getElementById(id)
        .getBoundingClientRect().top;
      const position = window.pageYOffset;
      const top = rectTop + position - this.headerHeight;
      window.scroll({
        top,
        behavior: 'smooth',
      });
    }
    return false;
  }

  clickedLike(articleId: string) {
    this.authService.user$
      .pipe(take(1))
      .toPromise()
      .then((user) => {
        if (user && !this.isLiked) {
          this.likeService.likeArticle(articleId, this.authService.uid);
          this.likeCount++;
          this.isLiked = true;
        } else if (user && this.isLiked) {
          this.likeService.unLikeArticle(articleId, this.authService.uid);
          this.likeCount--;
          this.isLiked = false;
        } else {
          this.openLoginDialog();
        }
      });
  }

  private openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
  }

  copyLink(): void {
    this.clipboard.copy(this.projectURL + this.path);
    this.snackBar.open('URLがコピーされました！', '閉じる');
  }
}
