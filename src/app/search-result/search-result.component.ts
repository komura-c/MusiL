import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { ArticleService } from '../services/article.service';
import { map, tap } from 'rxjs/operators';
import { Article } from '@interfaces/article';
import { LoadingService } from '../services/loading.service';
import { ScrollService } from '../services/scroll.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  private index = this.searchService.index.popular;
  private searchOptions = {
    page: 0,
    hitsPerPage: 20,
    facetFilters: ['isPublic:true'],
  };
  searchQuery: string;
  searchResult: {
    nbHits: number;
    hits: any[];
  };
  articles$: Observable<ArticleWithAuthor[]>;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private articleService: ArticleService,
    private loadingService: LoadingService,
    private scrollService: ScrollService,
    private seoService: SeoService,
  ) {
    this.loadingService.toggleLoading(true);
    this.route.queryParamMap.subscribe((params) => {
      this.searchQuery = params.get('q');
      if (this.searchQuery) {
        const metaTags = {
          title: `「${this.searchQuery}」の検索結果 | MusiL`,
          description: '検索結果を表示するページです',
          ogType: null,
          ogImage: null,
          twitterCard: null,
        };
        this.seoService.setTitleAndMeta(metaTags);
      } else {
        const metaTags = {
          title: `最新の記事一覧 | MusiL`,
          description: '最新の記事一覧を表示するページです',
          ogType: null,
          ogImage: null,
          twitterCard: null,
        };
        this.seoService.setTitleAndMeta(metaTags);
      }
      this.index
        .search(this.searchQuery, this.searchOptions)
        .then((searchResult) => {
          this.searchResult = searchResult;
          if (this.searchResult.hits) {
            const algoliaItemIds: string[] = this.searchResult.hits.map(
              (algoliaItem) => algoliaItem.articleId
            );
            this.articles$ = this.articleService.getLatestArticles().pipe(
              map((articles: ArticleWithAuthor[]) => {
                return articles.filter((article: Article) =>
                  algoliaItemIds.includes(article.articleId)
                );
              }),
              tap(() => {
                this.loadingService.toggleLoading(false);
                this.scrollService.restoreScrollPosition(this.searchQuery);
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
