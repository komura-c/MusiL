import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SearchGuard } from './search.guard';

describe('SearchGuard', () => {
  let guard: SearchGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    guard = TestBed.inject(SearchGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
