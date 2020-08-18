import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { ArticleService } from '../services/article.service';
import { map, tap, catchError } from 'rxjs/operators';
import { Article } from '@interfaces/article';
import { LoadingService } from '../services/loading.service';
import { ScrollService } from '../services/scroll.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  index = this.searchService.index.popular;
  searchQuery: string;

  searchResult: {
    nbHits: number;
    hits: any[];
  };
  searchOptions = {
    page: 0,
    hitsPerPage: 20,
    facetFilters: ['isPublic:true'],
  };

  articles$: Observable<ArticleWithAuthor[]>;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private articleService: ArticleService,
    private loadingService: LoadingService,
    private scrollService: ScrollService,
  ) {
    this.loadingService.toggleLoading(true);
    this.route.queryParamMap.subscribe((params) => {
      this.searchQuery = params.get('q');
      this.index
        .search(this.searchQuery, this.searchOptions)
        .then((searchResult) => (this.searchResult = searchResult))
        .then(() => {
          if (this.searchResult.hits) {
            const algoriaItemIds: string[] = this.searchResult.hits.map(
              (algoriaItem) => algoriaItem.articleId
            );
            this.articles$ = this.articleService.getLatestArticles().pipe(
              map((articles: ArticleWithAuthor[]) => {
                return articles.filter((article: Article) =>
                  algoriaItemIds.includes(article.articleId)
                );
              }),
              tap(() => {
                this.loadingService.toggleLoading(false);
                this.scrollService.restoreScrollPosition(this.searchQuery);
              }),
              catchError((error) => {
                console.log(error.message);
                this.loadingService.toggleLoading(false);
                return of(null);
              })
            );
          }
        });
    });
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.scrollService.saveScrollPosition(this.searchQuery);
  }
}
