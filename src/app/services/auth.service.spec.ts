import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fb: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let users: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let router: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let snackBar: any;

  beforeEach(() => {
    fb = {
      authState$: vi.fn().mockReturnValue(of(null)),
      signInWithTwitter: vi.fn(),
      getAdditionalUserInfo: vi.fn(),
      signOut: vi.fn().mockResolvedValue(undefined),
      deleteCurrentUser: vi.fn().mockResolvedValue(undefined),
    };
    users = {
      getUserData: vi.fn().mockReturnValue(of(null)),
      createUser: vi.fn().mockResolvedValue(undefined),
      updateUser: vi.fn().mockResolvedValue(undefined),
    };
    router = { navigateByUrl: vi.fn() };
    snackBar = { open: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: FirebaseService, useValue: fb },
        { provide: UserService, useValue: users },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('afUser$ returns auth state observable', async () => {
    fb.authState$.mockReturnValueOnce(of({ uid: 'x' }));
    const u = await firstValueFrom(service.afUser$);
    expect(u?.uid).toBe('x');
  });

  it('user$ returns null when not signed in', async () => {
    fb.authState$.mockReturnValueOnce(of(null));
    const result = await firstValueFrom(service.user$);
    expect(result).toBeNull();
  });

  it('user$ resolves user data when signed in', async () => {
    fb.authState$.mockReturnValueOnce(of({ uid: 'u1' }));
    users.getUserData.mockReturnValueOnce(of({ uid: 'u1', screenName: 'a' }));
    const result = await firstValueFrom(service.user$);
    expect(result?.uid).toBe('u1');
  });

  it('login creates user when no existing screenName', async () => {
    fb.signInWithTwitter.mockResolvedValueOnce({ user: { uid: 'u1' } });
    fb.getAdditionalUserInfo.mockReturnValueOnce({
      profile: { screen_name: 'alice' },
    });
    users.getUserData.mockReturnValueOnce(of(null));
    await service.login();
    await new Promise((r) => setTimeout(r, 0));
    expect(users.createUser).toHaveBeenCalled();
  });

  it('login updates user when existing screenName', async () => {
    fb.signInWithTwitter.mockResolvedValueOnce({ user: { uid: 'u1' } });
    fb.getAdditionalUserInfo.mockReturnValueOnce({
      profile: { screen_name: 'alice' },
    });
    users.getUserData.mockReturnValueOnce(
      of({ uid: 'u1', screenName: 'alice' })
    );
    await service.login();
    await new Promise((r) => setTimeout(r, 0));
    expect(users.updateUser).toHaveBeenCalled();
  });

  it('logout calls signOut and navigates', async () => {
    await service.logout();
    expect(fb.signOut).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('logout shows error on failure', async () => {
    fb.signOut.mockRejectedValueOnce(new Error('fail'));
    await service.logout();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('deleteUser delegates to FirebaseService', async () => {
    await service.deleteUser();
    expect(fb.deleteCurrentUser).toHaveBeenCalled();
  });

  it('renewSnapShotUser increments without error', () => {
    expect(() => service.renewSnapShotUser()).not.toThrow();
  });

  it('succeededLogin shows snackbar and navigates', () => {
    service.succeededLogin();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('failedLogin shows snackbar with error', () => {
    service.failedLogin({ message: 'err' });
    expect(snackBar.open).toHaveBeenCalled();
  });
});
