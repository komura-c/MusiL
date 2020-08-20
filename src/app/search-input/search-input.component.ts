import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { startWith, debounceTime, take } from 'rxjs/operators';
import { Subscription, pipe } from 'rxjs';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { UserService } from '../services/user.service';
import { UserData } from '@interfaces/user';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private index = this.searchService.index.popular;
  private searchOptions = {
    page: 0,
    hitsPerPage: 20,
    facetFilters: ['isPublic:true'],
  };

  searchControl: FormControl = new FormControl();
  searchResult: {
    nbHits: number;
    hits: any[];
  };
  isSearchActive = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private userService: UserService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const searchQuery: string = params.get('q');
      this.searchControl.patchValue(searchQuery, {
        emitEvent: false,
      });
    });
  }

  routeSearch(keyword: string): void {
    if (keyword === null) {
      keyword = '';
    }
    this.router.navigate(['/search'], {
      queryParamsHandling: 'merge',
      queryParams: { q: keyword },
    });
  }

  selectedTitle(option): void {
    this.userService
      .getUserData(option.uid)
      .pipe(take(1))
      .toPromise()
      .then((user: UserData) => {
        this.router.navigateByUrl(
          '/' + user.screenName + '/n/' + option.articleId
        );
      });
  }

  ngOnInit(): void {
    this.subscription = this.searchControl.valueChanges
      .pipe(startWith(''), debounceTime(500))
      .subscribe((keyword: string) => {
        this.index
          .search(keyword, this.searchOptions)
          .then((searchResult) => (this.searchResult = searchResult));
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
