import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Article } from '@interfaces/article';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../services/search.service';
import { ArticleService } from '../services/article.service';
import { LoadingService } from '../services/loading.service';
import { ScrollService } from '../services/scroll.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-tag-result',
  templateUrl: './tag-result.component.html',
  styleUrls: ['./tag-result.component.scss'],
})
export class TagResultComponent implements OnInit, OnDestroy {
  index = this.searchService.index.popular;
  searchTag: string;

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
    private seoService: SeoService
  ) {
    this.loadingService.toggleLoading(true);
    this.route.paramMap.subscribe((params) => {
      this.searchTag = params.get('id');
      const metaTags = {
        title: `${this.searchTag}に関する記事 | MusiL`,
        description: 'タグの関連記事を表示するページです',
        ogType: null,
        ogImage: null,
        twitterCard: null,
      };
      this.seoService.setTitleAndMeta(metaTags);
      this.searchOptions.facetFilters.push('tags:' + this.searchTag);
      this.index
        .search('', this.searchOptions)
        .then((searchResult) => (this.searchResult = searchResult))
        .then(() => {
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
                this.scrollService.restoreScrollPosition(this.searchTag);
              })
            );
          }
        });
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.scrollService.saveScrollPosition(this.searchTag);
  }
}
