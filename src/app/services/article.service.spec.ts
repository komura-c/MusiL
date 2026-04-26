import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { Article } from '@interfaces/article';
import { UserData } from '@interfaces/user';
import { ArticleService } from './article.service';
import { FirebaseService } from './firebase.service';
import { UserService } from './user.service';

const mockUser: UserData = {
  uid: 'u1',
  userName: 'Alice',
  avatarURL: '',
  screenName: 'alice',
  description: '',
};

function makeArticle(overrides: Partial<Article> = {}): Article {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ts = { toMillis: () => 0, toDate: () => new Date(0) } as any;
  return {
    articleId: 'a1',
    uid: 'u1',
    title: 't',
    text: 'body',
    isPublic: true,
    likeCount: 0,
    createdAt: ts,
    updatedAt: ts,
    tags: [],
    thumbnailURL: '',
    ...overrides,
  } as Article;
}

describe('ArticleService', () => {
  let service: ArticleService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fb: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let users: any;

  beforeEach(() => {
    fb = {
      collection: vi.fn().mockReturnValue({ id: 'col' }),
      doc: vi.fn((_p: unknown, id?: string) => ({ id: id ?? 'gen-id' })),
      query: vi.fn().mockReturnValue({}),
      getDoc: vi.fn(),
      collectionData: vi.fn().mockReturnValue(of([])),
      setDoc: vi.fn().mockResolvedValue(undefined),
      updateDoc: vi.fn().mockResolvedValue(undefined),
      deleteDoc: vi.fn().mockResolvedValue(undefined),
      uploadBytes: vi.fn().mockResolvedValue('https://example.com/a.png'),
    };
    users = {
      getUserData: vi.fn().mockReturnValue(of(mockUser)),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: FirebaseService, useValue: fb },
        { provide: UserService, useValue: users },
      ],
    });
    service = TestBed.inject(ArticleService);
  });

  it('uploadImage delegates to FirebaseService.uploadBytes', async () => {
    const file = new File(['x'], 'pic.png', { type: 'image/png' });
    const url = await service.uploadImage('u1', file);
    expect(fb.uploadBytes).toHaveBeenCalled();
    expect(url).toBe('https://example.com/a.png');
  });

  it('createArticle calls setDoc and returns generated id', async () => {
    fb.doc.mockReturnValueOnce({ id: 'new-id' });
    const id = await service.createArticle({
      uid: 'u1',
      title: 't',
      text: 'body',
      isPublic: true,
      tags: [],
      thumbnailURL: '',
    } as Omit<Article, 'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'>);
    expect(id).toBe('new-id');
    expect(fb.setDoc).toHaveBeenCalled();
  });

  it('updateArticle delegates to updateDoc', async () => {
    await service.updateArticle('a1', {
      uid: 'u1',
      title: 't',
      text: 'body',
      isPublic: true,
      tags: [],
      thumbnailURL: '',
    } as Omit<Article, 'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'>);
    expect(fb.updateDoc).toHaveBeenCalled();
  });

  it('deleteArticle delegates to deleteDoc', async () => {
    await service.deleteArticle('a1');
    expect(fb.deleteDoc).toHaveBeenCalled();
  });

  it('getMyArticlesPublic maps articles with author', async () => {
    fb.collectionData.mockReturnValueOnce(of([makeArticle()]));
    const result = await firstValueFrom(service.getMyArticlesPublic(mockUser));
    expect(result).toBeTruthy();
    expect(result?.[0]?.author).toEqual(mockUser);
  });

  it('getMyArticlesPublic returns null when empty', async () => {
    fb.collectionData.mockReturnValueOnce(of([]));
    const result = await firstValueFrom(service.getMyArticlesPublic(mockUser));
    expect(result).toBeNull();
  });

  it('getMyArticles returns articles with cursor', async () => {
    fb.collectionData.mockReturnValueOnce(of([makeArticle({ articleId: 'a2' })]));
    const result = await firstValueFrom(service.getMyArticles('u1'));
    expect(result.articles.length).toBe(1);
    expect(result.lastArticle.articleId).toBe('a2');
  });

  it('getMyArticles with lastArticle adds startAfter', async () => {
    fb.collectionData.mockReturnValueOnce(of([]));
    const last = makeArticle();
    await firstValueFrom(service.getMyArticles('u1', last));
    expect(fb.query).toHaveBeenCalled();
  });

  it('getArticleOnly returns article when exists', async () => {
    const snap = { exists: () => true, data: () => makeArticle() };
    fb.getDoc.mockResolvedValueOnce(snap);
    const result = await firstValueFrom(service.getArticleOnly('a1'));
    expect(result?.articleId).toBe('a1');
  });

  it('getArticleOnly returns null when not exists', async () => {
    fb.getDoc.mockResolvedValueOnce({ exists: () => false });
    const result = await firstValueFrom(service.getArticleOnly('a1'));
    expect(result).toBeNull();
  });

  it('getArticleOnly returns null on error', async () => {
    fb.getDoc.mockRejectedValueOnce(new Error('boom'));
    const result = await firstValueFrom(service.getArticleOnly('a1'));
    expect(result).toBeNull();
  });

  it('getPopularArticles returns articles with authors', async () => {
    fb.collectionData.mockReturnValueOnce(of([makeArticle()]));
    const result = await firstValueFrom(service.getPopularArticles());
    expect(result?.[0]?.author).toEqual(mockUser);
  });

  it('getLatestArticles returns articles with authors', async () => {
    fb.collectionData.mockReturnValueOnce(of([makeArticle()]));
    const result = await firstValueFrom(service.getLatestArticles());
    expect(result?.[0]?.author).toEqual(mockUser);
  });

  it('getPickUpArticles returns articles with authors', async () => {
    fb.collectionData.mockReturnValueOnce(of([makeArticle()]));
    const result = await firstValueFrom(service.getPickUpArticles());
    expect(result?.[0]?.author).toEqual(mockUser);
  });

  it('getArticleWithAuthorByArticleIdAndScreenName returns null when screenName mismatch', async () => {
    fb.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => makeArticle(),
    });
    const result = await firstValueFrom(
      service.getArticleWithAuthorByArticleIdAndScreenName('a1', 'wrong')
    );
    expect(result).toBeNull();
  });

  it('getArticleWithAuthorByArticleIdAndScreenName returns article when match', async () => {
    fb.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => makeArticle(),
    });
    const result = await firstValueFrom(
      service.getArticleWithAuthorByArticleIdAndScreenName('a1', 'alice')
    );
    expect(result?.author).toEqual(mockUser);
  });
});
