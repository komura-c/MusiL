import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { ArticleService } from '../services/article.service';
import { map } from 'rxjs/operators';
import { Article } from '@interfaces/article';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  index = this.searchService.index.item;
  searchQuery: string;

  searchResult: {
    nbHits: number;
    hits: any[];
  };
  searchOptions = {
    page: 0,
    hitsPerPage: 20,
  };

  articles$: Observable<ArticleWithAuthor[]>;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private articleService: ArticleService,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.searchQuery = params.get('q');
      this.index.search(this.searchQuery).then((searchResult) => this.searchResult = searchResult)
        .then(() => {
          if (this.searchResult.hits) {
            const algoriaItemIds: string[] = this.searchResult.hits.map(algoriaItem => algoriaItem.articleId);
            this.articles$ = this.articleService.getArticlesWithAuthors().pipe(
              map((articles: ArticleWithAuthor[]) => {
                return articles.filter((article: Article) => algoriaItemIds.includes(article.articleId));
              })
            );
          }
        });
    });
  }

  ngOnInit() { }
}
