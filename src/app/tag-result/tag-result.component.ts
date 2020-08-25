import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, tap, take } from 'rxjs/operators';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Observable, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../services/search.service';
import { LoadingService } from '../services/loading.service';
import { ScrollService } from '../services/scroll.service';
import { SeoService } from '../services/seo.service';
import { UserService } from '../services/user.service';
import { UserData } from '@interfaces/user';
import { firestore } from 'firebase/app';

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
    private userService: UserService,
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
          if (this.searchResult?.hits) {
            const algoliaArticles = this.searchResult.hits;
            const authorIds: string[] = this.searchResult.hits?.map(
              (algoliaItem) => algoliaItem.uid
            );
            const authorUniqueIds: string[] = Array.from(new Set(authorIds));
            this.articles$ = combineLatest(
              authorUniqueIds?.map((userId) => {
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
                this.scrollService.restoreScrollPosition(this.searchTag);
              })
            );
          } else {
            this.loadingService.toggleLoading(false);
          }
        });
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.scrollService.saveScrollPosition(this.searchTag);
  }
}
