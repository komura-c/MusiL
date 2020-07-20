import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  index = this.searchService.index.item;
  searchResult: {
    nbHits: number;
    hits: any[];
  };
  searchOptions = {
    page: 0,
    hitsPerPage: 20,
  };

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {
    this.route.queryParamMap.subscribe((map) => {
      const searchQuery: string = map.get('q');
      this.index.search(searchQuery).then(
        (searchResult) => this.searchResult = searchResult);
    });
  }

  ngOnInit() { }
}
