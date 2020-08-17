import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { Article } from 'functions/src/interfaces/article';
import { UserData } from 'functions/src/interfaces/user';
import { LoadingService } from 'src/app/services/loading.service';
import { LikeService } from 'src/app/services/like.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
  article$: Observable<ArticleWithAuthor>;

  activeHeadingIndex: number;
  headingPositions: number[] = [];
  headingElements: Element[] = [];

  isLoading: boolean;

  likeCount: number;
  isLiked: boolean;

  path: string;

  @HostListener('window:scroll', ['$event'])
  getTableOfContents() {
    if (this.headingPositions.length) {
      const headerHeight = 70;
      const positon = window.pageYOffset + headerHeight;
      this.headingPositions.forEach((headingPositon, index) => {
        if (headingPositon < positon) {
          this.activeHeadingIndex = index;
        }
      });
    }
  }

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private userService: UserService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private likeService: LikeService,
    private snackBar: MatSnackBar,
    private location: Location,
    private clipboard: Clipboard
  ) {
    this.loadingService.toggleLoading(true);
    this.isLoading = true;
    this.path = this.location.path();
    this.route.paramMap.subscribe((params) => {
      const articleId = params.get('id');
      const post$ = this.articleService.getArticleOnly(articleId);
      let articleData: Article;
      this.article$ = post$.pipe(
        map((article: Article) => {
          articleData = article;
          return article.uid;
        }),
        switchMap((uid: string) => {
          return this.userService.getUserData(uid);
        }),
        map((author: UserData) => {
          if (
            (author && articleData.isPublic) ||
            this.authService.uid === author.uid
          ) {
            const result: ArticleWithAuthor = {
              ...articleData,
              author,
            };
            return result;
          } else {
            return null;
          }
        }),
        tap((article: ArticleWithAuthor) => {
          if (article) {
            if (!this.likeCount) {
              this.likeCount = article.likeCount;
              this.getHeading();
            }
            this.likeService
              .isLiked(article.articleId, this.authService.uid)
              .pipe(take(1))
              .subscribe((result) => {
                this.isLiked = result;
              });
          }
        }),
        tap(() => {
          this.loadingService.toggleLoading(false);
          this.isLoading = false;
        }),
        catchError((error) => {
          console.log(error.message);
          this.loadingService.toggleLoading(false);
          this.isLoading = false;
          return of(null);
        })
      );
    });
  }

  scrollToHeading(event) {
    const id = event.target.hash.replace('#', '');
    if (id !== '') {
      const rectTop = document.getElementById(id).getBoundingClientRect().top;
      const position = window.pageYOffset;
      const buffer = 70;
      const top = rectTop + position - buffer;
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
      const toATag = "<a href='$1' target='_blank'>$1</a>";
      const link = description.replace(linkReg, toATag);
      return link;
    } else {
      return description;
    }
  }

  isAuthor(author: UserData) {
    if (author.uid === this.authService.uid) {
      return true;
    } else {
      return false;
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
      this.snackBar.open('いいねをするには、ログインが必要です。', '閉じる', {
        duration: 5000,
      });
    }
  }

  copyLink(): void {
    this.clipboard.copy('https://dtmplace-ad671.web.app' + this.path);
    this.snackBar.open('URLがコピーされました！', '閉じる', { duration: 5000 });
  }

  ngOnInit(): void {}
}
