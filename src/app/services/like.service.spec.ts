import { TestBed } from '@angular/core/testing';
import { getCommonProviders } from 'src/test/test-helpers';
import { LikeService } from './like.service';

describe('LikeService', () => {
  let service: LikeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...getCommonProviders()],
    });
    service = TestBed.inject(LikeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
