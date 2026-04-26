import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ViewCountService } from './view-count.service';
import { FirebaseService } from './firebase.service';

describe('ViewCountService', () => {
  let service: ViewCountService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fb: any;

  beforeEach(() => {
    fb = {
      callFunction: vi.fn().mockResolvedValue({ data: {} }),
      doc: vi.fn().mockReturnValue({ id: 'd' }),
      getDoc: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: FirebaseService, useValue: fb }],
    });
    service = TestBed.inject(ViewCountService);
  });

  it('countUpArticleView calls Cloud Function', () => {
    service.countUpArticleView({ uid: 'u1', articleId: 'a1' });
    expect(fb.callFunction).toHaveBeenCalledWith('countUpArticleView', {
      uid: 'u1',
      articleId: 'a1',
    });
  });

  it('getViewCount returns 0 when doc missing', async () => {
    fb.getDoc.mockResolvedValueOnce({ exists: () => false });
    const result = await firstValueFrom(service.getViewCount('a1'));
    expect(result).toBe(0);
  });

  it('getViewCount returns viewCount when doc exists', async () => {
    fb.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ viewCount: 42 }),
    });
    const result = await firstValueFrom(service.getViewCount('a1'));
    expect(result).toBe(42);
  });

  it('getViewCount returns 0 when viewCount field missing', async () => {
    fb.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({}),
    });
    const result = await firstValueFrom(service.getViewCount('a1'));
    expect(result).toBe(0);
  });
});
