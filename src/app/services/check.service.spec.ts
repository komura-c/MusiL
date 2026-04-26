import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { CheckService } from './check.service';
import { FirebaseService } from './firebase.service';

describe('CheckService', () => {
  let service: CheckService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fb: any;

  beforeEach(() => {
    fb = {
      collection: vi.fn().mockReturnValue({}),
      query: vi.fn().mockReturnValue({}),
      collectionData: vi.fn().mockReturnValue(of([])),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: FirebaseService, useValue: fb }],
    });
    service = TestBed.inject(CheckService);
  });

  it('getUserScreenNameIsNull returns user list', async () => {
    fb.collectionData.mockReturnValueOnce(of([{ uid: 'u1' }]));
    const result = await firstValueFrom(service.getUserScreenNameIsNull());
    expect(result.length).toBe(1);
  });

  it('getArticleThumbnailURLIsNull returns article list', async () => {
    fb.collectionData.mockReturnValueOnce(of([{ articleId: 'a1' }]));
    const result = await firstValueFrom(service.getArticleThumbnailURLIsNull());
    expect(result.length).toBe(1);
  });
});
