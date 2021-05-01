import { TestBed } from '@angular/core/testing';

import { ViewCountService } from './view-count.service';

describe('ViewCountService', () => {
  let service: ViewCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
