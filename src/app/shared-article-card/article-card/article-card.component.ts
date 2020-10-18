import { Component, OnInit, Input } from '@angular/core';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LikeService } from 'src/app/services/like.service';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
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
