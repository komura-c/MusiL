import { Component, OnInit } from '@angular/core';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-related-article',
  templateUrl: './related-article.component.html',
  styleUrls: ['./related-article.component.scss'],
})
export class RelatedArticleComponent implements OnInit {
  articles$: Observable<
    ArticleWithAuthor[]
  > = this.articleService.getPickUpArticles().pipe(
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
  isLoading: boolean;

  constructor(private articleService: ArticleService) {
    this.isLoading = true;
  }

  ngOnInit(): void {}

  shuffleArticle(articles: ArticleWithAuthor[]) {
    for (let i = articles.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [articles[i], articles[rand]] = [articles[rand], articles[i]];
    }
    const filteredArticle = articles.filter((_, i) => i % 3 === 0);
    return filteredArticle;
  }
}
