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
});