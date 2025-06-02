import { TestBed } from '@angular/core/testing';
import algoliasearch from 'algoliasearch';
import { Auth } from '@angular/fire/auth';
import { environmentStub } from 'src/test/environment.stub';
import { AuthStub } from 'src/test/service.stub';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  const searchClientStub = algoliasearch(
    environmentStub.algolia.appId,
    environmentStub.algolia.searchKey
  );
  const indexStub = {
    latest: searchClientStub.initIndex(environmentStub.algolia.index_name),
    popular: searchClientStub.initIndex(
      environmentStub.algolia.index_name + '_popular'
    ),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Auth, useValue: AuthStub }],
    });
    service = TestBed.inject(SearchService);
    service.index = indexStub;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
