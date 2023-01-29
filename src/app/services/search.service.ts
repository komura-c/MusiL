import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.searchKey
);

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  index = {
    latest: searchClient.initIndex(environment.algolia.index_name),
    popular: searchClient.initIndex(
      environment.algolia.index_name + '_popular'
    ),
  };
}
