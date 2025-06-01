import { TestBed } from '@angular/core/testing';
import { getCommonProviders } from 'src/test/test-helpers';
import { CheckService } from './check.service';

describe('CheckService', () => {
  let service: CheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...getCommonProviders()],
    });
    service = TestBed.inject(CheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
