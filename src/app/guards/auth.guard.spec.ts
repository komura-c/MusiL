import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
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
    guard = TestBed.inject(AuthGuard);
  });

  it('canActivate redirects to / when not logged in', async () => {
    auth.afUser$ = of(null);
    const result = await firstValueFrom(guard.canActivate());
    expect(result).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('canActivate allows when logged in', async () => {
    auth.afUser$ = of({ uid: 'u1' });
    const result = await firstValueFrom(guard.canActivate());
    expect(result).toBe(true);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('canLoad redirects to / when not logged in', async () => {
    auth.afUser$ = of(null);
    const result = await firstValueFrom(guard.canLoad());
    expect(result).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('canLoad allows when logged in', async () => {
    auth.afUser$ = of({ uid: 'u1' });
    const result = await firstValueFrom(guard.canLoad());
    expect(result).toBe(true);
  });
});
