import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { startWith, debounceTime, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserData } from '@interfaces/user';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  private readonly index = this.searchService.index.popular;
  private subscription: Subscription;
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
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.forEach((params) => {
      const searchQuery: string = params.get('q');
      this.searchControl.patchValue(searchQuery, {
        emitEvent: false,
      });
    });
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

  routeSearch(keyword: string): void {
    if (keyword === null || /^ {1,}$/.test(keyword)) {
      return;
    } else {
      this.router.navigate(['/search'], {
        queryParamsHandling: 'merge',
        queryParams: { q: keyword },
      });
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.searchControl.patchValue(null);
    const article: any = event.option.value;
    if (article?.uid) {
      this.userService
        .getUserData(article.uid)
        .pipe(take(1))
        .toPromise()
        .then((user: UserData) => {
          this.router.navigateByUrl(
            '/' + user?.screenName + '/a/' + article?.articleId
          );
        });
    }
  }
}
