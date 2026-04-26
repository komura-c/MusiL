import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let auth: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let router: any;

  beforeEach(() => {
    auth = { afUser$: of(null) };
    router = { navigateByUrl: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
      ],
    });
    guard = TestBed.inject(AdminGuard);
  });

  it('canActivate returns false when not logged in', async () => {
    auth.afUser$ = of(null);
    const result = await firstValueFrom(guard.canActivate());
    expect(result).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('canActivate returns true when admin claim is set', async () => {
    auth.afUser$ = of({
      getIdTokenResult: () => Promise.resolve({ claims: { admin: true } }),
    });
    const result = await firstValueFrom(guard.canActivate());
    expect(result).toBe(true);
  });

  it('canActivate returns false when admin claim missing', async () => {
    auth.afUser$ = of({
      getIdTokenResult: () => Promise.resolve({ claims: {} }),
    });
    const result = await firstValueFrom(guard.canActivate());
    expect(result).toBeFalsy();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('canLoad returns true when admin', async () => {
    auth.afUser$ = of({
      getIdTokenResult: () => Promise.resolve({ claims: { admin: true } }),
    });
    const result = await firstValueFrom(guard.canLoad());
    expect(result).toBe(true);
  });
});
