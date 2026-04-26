import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CommentService } from './comment.service';
import { FirebaseService } from './firebase.service';

describe('CommentService', () => {
  let service: CommentService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fb: any;

  beforeEach(() => {
    fb = {
      collection: vi.fn().mockReturnValue({}),
      doc: vi.fn().mockReturnValue({ id: 'gen-id' }),
      setDoc: vi.fn().mockResolvedValue(undefined),
      deleteDoc: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: FirebaseService, useValue: fb }],
    });
    service = TestBed.inject(CommentService);
  });

  it('sendComment delegates to setDoc', async () => {
    await service.sendComment('a1', 'hello', 'u1');
    expect(fb.setDoc).toHaveBeenCalled();
  });

  it('deleteComment delegates to deleteDoc', async () => {
    await service.deleteComment('a1', 'c1');
    expect(fb.deleteDoc).toHaveBeenCalled();
  });

  it('getLatestArticleComments returns empty for empty articleId', async () => {
    const result = await firstValueFrom(service.getLatestArticleComments(''));
    expect(result).toEqual([]);
  });

  it('getLatestArticleComments returns empty array (placeholder impl)', async () => {
    const result = await firstValueFrom(service.getLatestArticleComments('a1'));
    expect(result).toEqual([]);
  });
});
