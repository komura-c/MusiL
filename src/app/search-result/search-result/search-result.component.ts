import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { map, tap, take } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { UserService } from 'src/app/services/user.service';
import { UserData } from '@interfaces/user';
import { firestore } from 'firebase/app';
import { PageEvent } from '@angular/material/paginator';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  private readonly index = this.searchService.index.popular;

  searchQuery: string;
  searchTag: string;

  defaultPageIndex = 0;
  pageIndex: number;
  defaultPageSize = 20;
  searchResult: {
    nbHits: number;
    hits: any[];
  };
  articles$: Observable<ArticleWithAuthor[]>;

  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private userService: UserService,
    private router: Router,
    private loadingService: LoadingService,
    private scrollService: ScrollService,
    private seoService: SeoService
  ) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.route.paramMap.forEach((params) => {
      this.searchTag = params.get('id');
      if (this.searchTag) {
        this.seoService.updateTitleAndMeta({
          title: `${this.searchTag}に関する記事 | MusiL`,
          description: 'タグの関連記事を表示するページです',
        });
      }
    });
    this.route.queryParamMap.forEach((params) => {
      this.searchQuery = params.get('q');
      if (this.searchQuery) {
        this.seoService.updateTitleAndMeta({
          title: `「${this.searchQuery}」の検索結果 | MusiL`,
          description: '検索結果を表示するページです',
        });
      }
      const pageIndexParam = params.get('page');
      this.pageIndex = +pageIndexParam;
      this.search(this.pageIndex || null);
    });
  }

  ngOnDestroy(): void {
    if (this.searchQuery) {
      this.scrollService.saveScrollPosition(this.searchQuery);
    }
    if (this.searchTag) {
      this.scrollService.saveScrollPosition(this.searchTag);
    }
  }

  routeSearch(event?: PageEvent): void {
    if (this.searchQuery) {
      this.router.navigate(['/search'], {
        queryParamsHandling: 'merge',
        queryParams: {
          q: this.searchQuery,
          page: event ? event.pageIndex : this.defaultPageIndex,
        },
      });
    }
    if (this.searchTag) {
      this.router.navigate(['/tags', this.searchTag], {
        queryParamsHandling: 'merge',
        queryParams: { page: event ? event.pageIndex : this.defaultPageIndex },
      });
    }
  }

  search(pageIndex?: number) {
    const searchOptions = {
      page: pageIndex ? pageIndex : this.defaultPageIndex,
      hitsPerPage: this.defaultPageSize,
      facetFilters: ['isPublic:true'],
    };
    if (this.searchQuery) {
      this.index
        .search(this.searchQuery, searchOptions)
        .then((searchResult: { nbHits: number; hits: any[] }) => {
          this.searchResultWithFirestore(searchResult);
        });
    }
    if (this.searchTag) {
      searchOptions.facetFilters.push('tags:' + this.searchTag);
      this.index
        .search('', searchOptions)
        .then((searchResult: { nbHits: number; hits: any[] }) => {
          this.searchResultWithFirestore(searchResult);
        });
    }
  }

  searchResultWithFirestore(searchResult: { nbHits: number; hits: any[] }) {
    this.searchResult = searchResult;
    if (this.searchResult?.hits?.length) {
      const algoliaArticles = this.searchResult.hits;
      const authorIds: string[] = algoliaArticles.map(
        (algoliaItem) => algoliaItem.uid
      );
      const authorUniqueIds: string[] = Array.from(new Set(authorIds));
      const users$ = combineLatest(
        authorUniqueIds.map((userId) => {
          return this.userService.getUserData(userId);
        })
      );
      this.articles$ = users$.pipe(
        take(1),
        map((users) => {
          if (algoliaArticles?.length) {
            return algoliaArticles.map((article) => {
              const result: ArticleWithAuthor = {
                ...article,
                createdAt: firestore.Timestamp.fromMillis(article.createdAt),
                updatedAt: firestore.Timestamp.fromMillis(article.updatedAt),
                author: users?.find(
                  (user: UserData) => user.uid === article.uid
                ),
              };
              return result;
            });
          } else {
            return null;
          }
        }),
        tap(() => {
          this.isLoading = false;
          if (this.searchQuery) {
            this.scrollService.restoreScrollPosition(this.searchQuery);
          }
          if (this.searchTag) {
            this.scrollService.restoreScrollPosition(this.searchTag);
          }
        })
      );
    } else {
      this.isLoading = false;
    }
  }
}
