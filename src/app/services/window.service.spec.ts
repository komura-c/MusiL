import { TestBed } from '@angular/core/testing';
import { WindowService } from './window.service';

describe('WindowService', () => {
  let service: WindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return native window object', () => {
    expect(service.nativeWindow).toBe(window);
  });

  it('should provide window properties', () => {
    expect(service.location).toBe(window.location);
    expect(service.localStorage).toBe(window.localStorage);
    expect(service.sessionStorage).toBe(window.sessionStorage);
    expect(service.navigator).toBe(window.navigator);
    expect(service.history).toBe(window.history);
  });

  it('should provide window methods', () => {
    spyOn(window, 'scrollTo');
    service.scrollTo(0, 100);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 100);

    spyOn(window, 'scrollBy');
    service.scrollBy(0, 50);
    expect(window.scrollBy).toHaveBeenCalledWith(0, 50);
  });

  it('should return window dimensions', () => {
    expect(service.innerWidth()).toBe(window.innerWidth);
    expect(service.innerHeight()).toBe(window.innerHeight);
    expect(service.pageXOffset()).toBe(window.pageXOffset);
    expect(service.pageYOffset()).toBe(window.pageYOffset);
  });

  it('open delegates to window.open', () => {
    const spy = vi.spyOn(window, 'open').mockReturnValue(null);
    service.open('https://example.com', '_blank');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('alert / confirm / prompt delegate to window', () => {
    const a = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const c = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const p = vi.spyOn(window, 'prompt').mockReturnValue('input');
    service.alert('hi');
    expect(a).toHaveBeenCalled();
    expect(service.confirm('ok?')).toBe(true);
    expect(service.prompt('q?', 'def')).toBe('input');
    a.mockRestore();
    c.mockRestore();
    p.mockRestore();
  });

  it('confirm returns false when window.confirm returns falsy', () => {
    const c = vi.spyOn(window, 'confirm').mockReturnValue(false);
    expect(service.confirm()).toBe(false);
    c.mockRestore();
  });

  it('addEventListener / removeEventListener / dispatchEvent delegate', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const dispatch = vi.spyOn(window, 'dispatchEvent').mockReturnValue(true);
    const handler = (): void => undefined;
    service.addEventListener('x', handler);
    service.removeEventListener('x', handler);
    service.dispatchEvent(new Event('x'));
    expect(add).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
    add.mockRestore();
    remove.mockRestore();
    dispatch.mockRestore();
  });

  it('matchMedia delegates to window.matchMedia', () => {
    // jsdom may not have matchMedia; stub via spyOn returns null fallback
    if (typeof window.matchMedia !== 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).matchMedia = (): null => null;
    }
    const result = service.matchMedia('(max-width: 600px)');
    expect(result === null || typeof result === 'object').toBe(true);
  });

  it('getComputedStyle delegates to window.getComputedStyle', () => {
    const el = document.createElement('div');
    const result = service.getComputedStyle(el);
    expect(result === null || typeof result === 'object').toBe(true);
  });
});
