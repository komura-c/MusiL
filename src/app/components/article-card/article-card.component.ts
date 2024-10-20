import { Component, OnInit, Input } from '@angular/core';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LikeService } from 'src/app/services/like.service';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
  standalone: true,
  imports: [RouterLink, NgIf, MatIconModule, DatePipe],
})
export class ArticleCardComponent implements OnInit {
  @Input() article: ArticleWithAuthor;
  isLiked: boolean;
  likeCount: number;

  constructor(
    private likeService: LikeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.likeCount = this.article.likeCount;
    this.updateLikeCount();
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
