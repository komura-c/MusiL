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

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit, OnDestroy {
  private articleId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => {
      this.articleId = params.get('id');
      return params.get('id');
    })
  );
  articleId: string;
  article$: Observable<ArticleWithAuthor> = this.articleId$.pipe(
    switchMap((articleId: string) => {
      return this.articleService
        .getArticleWithAuthorOnly(articleId)
        .pipe(take(1));
    }),
    map((article: ArticleWithAuthor) => {
      if (article?.isPublic || this.authService.uid === article?.author?.uid) {
        return article;
      } else {
        return null;
      }
    }),
    tap((article: ArticleWithAuthor) => {
      if (article) {
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
        const html2textReg = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);
        const descriptionMaxLength = 120;
        const description =
          article.text
            ?.replace(html2textReg, '')
            .slice(0, descriptionMaxLength) + '…';
        const metaTags = {
          title: `${article.title} | MusiL`,
          description,
          ogType: 'article',
          ogImage: null,
          twitterCard: null,
        };
        this.seoService.setTitleAndMeta(metaTags);
      }
    }),
    tap(() => {
      this.getHeading();
      this.loadingService.toggleLoading(false);
      this.isLoading = false;
      this.scrollService.restoreScrollPosition(this.articleId);
    })
  );

  activeHeadingIndex: number;
  headingPositions: number[] = [];
  headingElements: Element[] = [];
  headerHeight = 70;

  isLoading = true;

  likeCount: number;
  isLiked: boolean;

  projectURL = environment.hostingURL;
  path: string = this.location.path();

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
    public authService: AuthService
  ) {
    this.loadingService.toggleLoading(true);
    this.isLoading = true;
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

  getHeading() {
    setTimeout(() => {
      const headingTagElements = document.querySelectorAll(
        '.note-content h1, .note-content h2, .note-content h3, .note-content h4'
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

  clickedLike(articleId: string) {
    if (this.authService.uid && !this.isLiked) {
      this.likeService.likeArticle(articleId, this.authService.uid);
      this.likeCount++;
      this.isLiked = true;
    } else if (this.authService.uid && this.isLiked) {
      this.likeService.unLikeArticle(articleId, this.authService.uid);
      this.likeCount--;
      this.isLiked = false;
    } else {
      this.snackBar.open('いいねをするには、ログインが必要です。', '閉じる');
    }
  }

  copyLink(): void {
    this.clipboard.copy(this.projectURL + this.path);
    this.snackBar.open('URLがコピーされました！', '閉じる');
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.scrollService.saveScrollPosition(this.articleId);
  }
}
