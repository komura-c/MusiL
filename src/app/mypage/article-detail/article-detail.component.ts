import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { Observable } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { LoadingService } from 'src/app/services/loading.service';
import { LikeService } from 'src/app/services/like.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { ScrollService } from 'src/app/services/scroll.service';
import { SeoService } from 'src/app/services/seo.service';
import { environment } from 'src/environments/environment';
import { LoginDialogComponent } from 'src/app/shared-login-dialog/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  private screenName = this.route.snapshot.parent.paramMap.get('id');
  private articleId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => {
      this.articleId = params.get('id');
      return params.get('id');
    })
  );
  private articleId: string;
  article$: Observable<ArticleWithAuthor> = this.articleId$.pipe(
    switchMap((articleId: string) => {
      return this.articleService
        .getArticleWithAuthorByArticleIdAndScreenName(
          articleId,
          this.screenName
        )
        .pipe(take(1));
    }),
    tap((article: ArticleWithAuthor) => {
      if (article) {
        this.initLikeStatus(article);
        this.seoService.updateTitleAndMeta({
          title: `${article.title}`,
          description: article.text,
        });
        this.seoService.createLinkTagForCanonicalURL();
      }
    }),
    tap(() => {
      this.getHeading();
      this.isLoading = false;
      this.loadingService.toggleLoading(false);
      this.scrollService.restoreScrollPosition(this.articleId);
    })
  );

  activeHeadingIndex: number;
  headingPositions: number[] = [];
  headingElements: Element[] = [];
  headerHeight = 70;

  isLoading: boolean;

  likeCount: number;
  isLiked: boolean;

  projectURL = environment.hostingURL;
  path: string = this.location.path();

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private loadingService: LoadingService,
    private likeService: LikeService,
    private snackBar: MatSnackBar,
    private location: Location,
    private clipboard: Clipboard,
    private seoService: SeoService,
    private scrollService: ScrollService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {
    this.loadingService.toggleLoading(true);
    this.isLoading = true;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.scrollService.saveScrollPosition(this.articleId);
  }

  private initLikeStatus(article: ArticleWithAuthor) {
    if (!this.likeCount) {
      this.likeCount = article.likeCount;
    }
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
    if (this.headingPositions.length) {
      const buffer = 20;
      const position = window.pageYOffset + this.headerHeight + buffer;
      this.headingPositions.forEach((headingPosition, index) => {
        if (headingPosition < position) {
          this.activeHeadingIndex = index;
        }
      });
    }
  }

  getHeading() {
    setTimeout(() => {
      const headingTagElements = document.querySelectorAll(
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

  scrollToHeading(event) {
    const id = event.target.hash.replace('#', '');
    if (id !== '') {
      const rectTop = document.getElementById(id).getBoundingClientRect().top;
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
