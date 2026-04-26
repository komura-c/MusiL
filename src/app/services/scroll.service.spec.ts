import { TestBed } from '@angular/core/testing';
import { ScrollService } from './scroll.service';
import { WindowService } from './window.service';

describe('ScrollService', () => {
  let service: ScrollService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let win: any;

  beforeEach(() => {
    win = {
      pageYOffset: vi.fn().mockReturnValue(123),
      scrollTo: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: WindowService, useValue: win }],
    });
    service = TestBed.inject(ScrollService);
  });

  it('saveScrollPosition stores y offset by id', () => {
    service.saveScrollPosition('a1');
    expect(service.scrollPosYs['a1']).toBe(123);
  });

  it('saveScrollPosition is no-op when id is empty', () => {
    service.saveScrollPosition('');
    expect(Object.keys(service.scrollPosYs).length).toBe(0);
  });

  it('restoreScrollPosition schedules scrollTo via setTimeout', async () => {
    service.scrollPosYs['a1'] = 200;
    service.restoreScrollPosition('a1');
    await new Promise((r) => setTimeout(r, 50));
    expect(win.scrollTo).toHaveBeenCalledWith(0, 200);
  });

  it('restoreScrollPosition uses 0 when id has no saved position', async () => {
    service.restoreScrollPosition('unknown');
    await new Promise((r) => setTimeout(r, 50));
    expect(win.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
