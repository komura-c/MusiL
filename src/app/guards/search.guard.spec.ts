import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SearchGuard } from './search.guard';

describe('SearchGuard', () => {
  let guard: SearchGuard;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let router: any;

  beforeEach(() => {
    router = { navigateByUrl: vi.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: router }],
    });
    guard = TestBed.inject(SearchGuard);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function snap(query?: string, id?: string): any {
    return {
      queryParamMap: { get: (k: string) => (k === 'q' ? query ?? null : null) },
      paramMap: { get: (k: string) => (k === 'id' ? id ?? null : null) },
    };
  }

  it('returns true when query parameter q is set', () => {
    expect(guard.canActivate(snap('hello'))).toBe(true);
  });

  it('returns true when path id is set', () => {
    expect(guard.canActivate(snap(undefined, 'tag1'))).toBe(true);
  });

  it('redirects to / and returns false when neither set', () => {
    expect(guard.canActivate(snap())).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
