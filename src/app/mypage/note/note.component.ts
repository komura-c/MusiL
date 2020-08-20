import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { Article } from 'functions/src/interfaces/article';
import { LoadingService } from 'src/app/services/loading.service';
import { LikeService } from 'src/app/services/like.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { ScrollService } from 'src/app/services/scroll.service';

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
      return this.articleService.getArticleOnly(articleId);
    }),
    switchMap((article: Article) => {
      return combineLatest([of(article), this.userService.getUserData(article.uid)]
      );
    }),
    map(([article, author]) => {
      if (
        (author && article.isPublic) ||
        this.authService.uid === author?.uid
      ) {
        const result: ArticleWithAuthor = {
          ...article,
          author,
        };
        return result;
      } else {
        return null;
      }
    }),
    tap((article: ArticleWithAuthor) => {
      if (!this.likeCount) {
        this.likeCount = article?.likeCount;
        this.getHeading();
      }
      this.likeService
        .isLiked(article?.articleId, this.authService.uid)
        .pipe(take(1))
        .toPromise().then((result) => {
          this.isLiked = result;
        });
    }),
    tap(() => {
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
    private userService: UserService,
    private loadingService: LoadingService,
    private likeService: LikeService,
    private snackBar: MatSnackBar,
    private location: Location,
    private clipboard: Clipboard,
    private scrollService: ScrollService,
    public authService: AuthService,
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
      window.scrollTo({
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

  stringToLink(description: string): string {
    const linkReg = new RegExp(
      /(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#]+)/gi
    );
    if (linkReg.test(description)) {
      const toATag = '<a href=\'$1\' target=\'_blank\'>$1</a>';
      const link = description.replace(linkReg, toATag);
      return link;
    } else {
      return description;
    }
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
    this.clipboard.copy('https://dtmplace-ad671.web.app' + this.path);
    this.snackBar.open('URLがコピーされました！', '閉じる');
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.scrollService.saveScrollPosition(this.articleId);
  }
}
