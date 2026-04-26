import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { LikeService } from './like.service';
import { FirebaseService } from './firebase.service';

describe('LikeService', () => {
  let service: LikeService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fb: any;

  beforeEach(() => {
    fb = {
      doc: vi.fn().mockReturnValue({ id: 'd' }),
      setDoc: vi.fn().mockResolvedValue(undefined),
      deleteDoc: vi.fn().mockResolvedValue(undefined),
      getDoc: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: FirebaseService, useValue: fb }],
    });
    service = TestBed.inject(LikeService);
  });

  it('likeArticle delegates to setDoc', async () => {
    await service.likeArticle('a1', 'u1');
    expect(fb.setDoc).toHaveBeenCalled();
  });

  it('unLikeArticle delegates to deleteDoc', async () => {
    await service.unLikeArticle('a1', 'u1');
    expect(fb.deleteDoc).toHaveBeenCalled();
  });

  it('isLiked returns true when doc exists', async () => {
    fb.getDoc.mockResolvedValueOnce({ exists: () => true });
    const result = await firstValueFrom(service.isLiked('a1', 'u1'));
    expect(result).toBe(true);
  });

  it('isLiked returns false when doc does not exist', async () => {
    fb.getDoc.mockResolvedValueOnce({ exists: () => false });
    const result = await firstValueFrom(service.isLiked('a1', 'u1'));
    expect(result).toBe(false);
  });
});
