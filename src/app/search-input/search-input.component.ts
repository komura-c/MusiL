import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { startWith, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit {
  searchControl: FormControl = new FormControl();

  index = this.searchService.index.popular;
  searchResult: {
    nbHits: number;
    hits: any[];
  };
  searchOptions = {
    page: 0,
    hitsPerPage: 8,
    facetFilters: ['isPublic:true'],
  };

  isSearchActive: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const searchQuery: string = params.get('q');
      this.searchControl.patchValue(searchQuery, {
        emitEvent: false,
      });
    });
  }

  routeSearch(keyword: string) {
    if (keyword === null) {
      keyword = '';
    }
    this.router.navigate(['/search'], {
      queryParamsHandling: 'merge',
      queryParams: { q: keyword },
    });
  }

  searchActive() {
    if (this.isSearchActive === false) {
      this.isSearchActive = true;
    } else {
      this.isSearchActive = false;
    }
  }

  ngOnInit(): void {
    this.isSearchActive = false;
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(500)).subscribe((keyword) => {
      const searchKeyword: string = keyword;
      this.index
        .search(searchKeyword, this.searchOptions)
        .then((searchResult) => (this.searchResult = searchResult));
    });
  }
}
