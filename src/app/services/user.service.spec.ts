import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { UserService } from './user.service';
import { FirebaseService } from './firebase.service';

describe('UserService', () => {
  let service: UserService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fb: any;

  beforeEach(() => {
    fb = {
      collection: vi.fn().mockReturnValue({}),
      doc: vi.fn().mockReturnValue({ id: 'd' }),
      query: vi.fn().mockReturnValue({}),
      getDoc: vi.fn(),
      collectionData: vi.fn().mockReturnValue(of([])),
      setDoc: vi.fn().mockResolvedValue(undefined),
      updateDoc: vi.fn().mockResolvedValue(undefined),
      uploadString: vi.fn().mockResolvedValue('https://example.com/avatar.png'),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: FirebaseService, useValue: fb }],
    });
    service = TestBed.inject(UserService);
  });

  it('getUserData returns data when exists', async () => {
    fb.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ uid: 'u1', screenName: 'alice' }),
    });
    const result = await firstValueFrom(service.getUserData('u1'));
    expect(result?.uid).toBe('u1');
  });

  it('getUserData returns null when not exists', async () => {
    fb.getDoc.mockResolvedValueOnce({ exists: () => false });
    const result = await firstValueFrom(service.getUserData('u1'));
    expect(result).toBeNull();
  });

  it('getUserByScreenName returns first match', async () => {
    fb.collectionData.mockReturnValueOnce(of([{ uid: 'u1', screenName: 'a' }]));
    const result = await firstValueFrom(service.getUserByScreenName('a'));
    expect(result?.uid).toBe('u1');
  });

  it('getUserByScreenName returns null when no match', async () => {
    fb.collectionData.mockReturnValueOnce(of([]));
    const result = await firstValueFrom(service.getUserByScreenName('x'));
    expect(result).toBeNull();
  });

  it('createUser delegates to setDoc', async () => {
    const profile = {
      name: 'Alice',
      profile_image_url_https: 'https://example.com/_normal.jpg',
      screen_name: 'alice',
      description: 'hi',
    };
    await service.createUser('u1', profile);
    expect(fb.setDoc).toHaveBeenCalled();
  });

  it('updateUser delegates to updateDoc', async () => {
    await service.updateUser('u1', { screen_name: 'alice' });
    expect(fb.updateDoc).toHaveBeenCalled();
  });

  it('uploadAvatar uploads then updates user doc', async () => {
    await service.uploadAvatar('u1', 'data:image/png;base64,xxx');
    expect(fb.uploadString).toHaveBeenCalled();
    expect(fb.updateDoc).toHaveBeenCalled();
  });

  it('changeUserData delegates to updateDoc', async () => {
    await service.changeUserData('u1', {
      userName: 'Bob',
      description: 'd',
    });
    expect(fb.updateDoc).toHaveBeenCalled();
  });
});
