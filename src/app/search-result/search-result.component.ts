import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { map, tap, take } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { ScrollService } from '../services/scroll.service';
import { SeoService } from '../services/seo.service';
import { UserService } from '../services/user.service';
import { UserData } from '@interfaces/user';
import { firestore } from 'firebase/app';

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
    private userService: UserService,
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
          if (this.searchResult?.hits?.length) {
            const algoliaArticles = this.searchResult.hits;
            const authorIds: string[] = this.searchResult.hits.map(
              (algoliaItem) => algoliaItem.uid
            );
            const authorUniqueIds: string[] = Array.from(new Set(authorIds));
            this.articles$ = combineLatest(
              authorUniqueIds.map((userId) => {
                return this.userService.getUserData(userId);
              })
            ).pipe(
              take(1),
              map((users) => {
                if (algoliaArticles?.length) {
                  return algoliaArticles.map((article) => {
                    const createdAtDate = new Date(article.createdAt);
                    const updatedAtDate = new Date(article.updatedAt);
                    const result: ArticleWithAuthor = {
                      ...article,
                      createdAt: firestore.Timestamp.fromDate(createdAtDate),
                      updatedAt: firestore.Timestamp.fromDate(updatedAtDate),
                      author: users?.find((user: UserData) => user.uid === article.uid),
                    };
                    return result;
                  });
                } else {
                  return null;
                }
              }),
              tap(() => {
                this.loadingService.toggleLoading(false);
                this.scrollService.restoreScrollPosition(this.searchQuery);
              })
            );
          } else {
            this.loadingService.toggleLoading(false);
          }
        });
    });
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.scrollService.saveScrollPosition(this.searchQuery);
  }
}
