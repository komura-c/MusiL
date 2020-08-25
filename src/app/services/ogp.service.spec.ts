import { TestBed } from '@angular/core/testing';

import { OgpService } from './ogp.service';

describe('OgpService', () => {
  let service: OgpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OgpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
