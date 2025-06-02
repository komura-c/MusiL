import { Component, OnInit, Input } from '@angular/core';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LikeService } from 'src/app/services/like.service';
import { ViewCountService } from 'src/app/services/view-count.service';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, DatePipe, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
  standalone: true,
  imports: [RouterLink, NgIf, MatIconModule, DatePipe, AsyncPipe],
})
export class ArticleCardComponent implements OnInit {
  @Input() article: ArticleWithAuthor;
  isLiked: boolean;
  likeCount: number;
  viewCount$: Observable<number>;

  constructor(
    private likeService: LikeService,
    private authService: AuthService,
    private viewCountService: ViewCountService
  ) {}

  ngOnInit() {
    this.likeCount = this.article.likeCount;
    this.updateLikeCount();
    this.viewCount$ = this.viewCountService.getViewCount(this.article.articleId);
  }

  updateLikeCount() {
    if (this.authService.uid) {
      this.likeService
        .isLiked(this.article.articleId, this.authService.uid)
        .pipe(take(1))
        .toPromise()
        .then((result) => {
          this.isLiked = result;
          this.likeCount = this.article.likeCount;
        });
    }
  }
}
