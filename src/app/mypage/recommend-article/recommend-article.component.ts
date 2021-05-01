import { Component, Input, OnInit } from '@angular/core';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-recommend-article',
  templateUrl: './recommend-article.component.html',
  styleUrls: ['./recommend-article.component.scss'],
})
export class RecommendArticleComponent implements OnInit {
  @Input() currentArticle: ArticleWithAuthor;
  articles$: Observable<ArticleWithAuthor[]>;
  isLoading: boolean;

  constructor(private articleService: ArticleService) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles() {
    this.articles$ = this.articleService.getPickUpArticles().pipe(
      take(1),
      map((articles) => {
        if (articles.length) {
          return this.shuffleArticle(articles);
        } else {
          return null;
        }
      }),
      tap(() => {
        this.isLoading = false;
      })
    );
  }

  shuffleArticle(articles: ArticleWithAuthor[]) {
    for (let i = articles.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [articles[i], articles[rand]] = [articles[rand], articles[i]];
    }
    const filteredArticle = this.filterArticle(articles);
    return filteredArticle;
  }

  filterArticle(articles: ArticleWithAuthor[]) {
    return articles.filter(
      (article, i) =>
        article?.articleId !== this.currentArticle.articleId && i % 2 === 0
    );
  }
}
