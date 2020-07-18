import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { Article } from 'functions/src/interfaces/article';
import { UserData } from 'functions/src/interfaces/user';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit, AfterViewInit {
  article$: Observable<ArticleWithAuthor>;
  articleId: string;

  activeHeadingIndex: number;
  headingPositions: number[] = [];
  headingElements: Element[] = [];

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
  ) {
    this.route.paramMap.subscribe(params => {
      this.articleId = params.get('id');
      const post$ = this.articleService.getArticleOnly(this.articleId);
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
          const result: ArticleWithAuthor = {
            ...articleData,
            author,
          };
          if ((articleData.isPublic === true) || (this.authService.uid === author.uid)) {
            return result;
          } else {
            return null;
          }
        })
      );
    });
  }

  anchorLinkFixed(event) {
    const id = event.target.hash.replace('#', '');
    if (id !== '') {
      const rectTop = document.getElementById(id).getBoundingClientRect().top;
      const position = window.pageYOffset;
      const buffer = 70;
      const top = rectTop + position - buffer;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
    return false;
  }

  ngAfterViewInit() {
    if (this.article$) {
      setTimeout(() => {
        const headingTagElements = document.querySelectorAll('.note-content h1, .note-content h2, .note-content h3, .note-content h4');
        headingTagElements.forEach((headingTagElement, index) => {
          headingTagElement.id = 'chapter-' + index;
          this.headingElements.push(headingTagElement);
          this.headingPositions.push(headingTagElement.getBoundingClientRect().top);
        });
      }, 1500);
    }
  }

  ngOnInit(): void {
  }

}
