export class MockWindowService {
  private _window = {
    location: { href: 'http://localhost:4200', reload: jasmine.createSpy('reload') },
    localStorage: {},
    sessionStorage: {},
    navigator: { userAgent: 'test-user-agent' },
    history: {},
    innerWidth: 1024,
    innerHeight: 768,
    pageXOffset: 0,
    pageYOffset: 0
  };

  get nativeWindow() {
    return this._window as any;
  }

  get location() {
    return this._window.location;
  }

  get localStorage() {
    return this._window.localStorage;
  }

  get sessionStorage() {
    return this._window.sessionStorage;
  }

  get navigator() {
    return this._window.navigator as any;
  }

  get history() {
    return this._window.history;
  }

  open = jasmine.createSpy('open').and.returnValue(null);
  scrollTo = jasmine.createSpy('scrollTo');
  scrollBy = jasmine.createSpy('scrollBy');
  alert = jasmine.createSpy('alert');
  confirm = jasmine.createSpy('confirm').and.returnValue(true);
  prompt = jasmine.createSpy('prompt').and.returnValue(null);
  getComputedStyle = jasmine.createSpy('getComputedStyle').and.returnValue({});
  matchMedia = jasmine.createSpy('matchMedia').and.returnValue({ matches: false });
  addEventListener = jasmine.createSpy('addEventListener');
  removeEventListener = jasmine.createSpy('removeEventListener');
  dispatchEvent = jasmine.createSpy('dispatchEvent').and.returnValue(true);

  reload = jasmine.createSpy('reload');

  innerWidth(): number {
    return this._window.innerWidth;
  }

  innerHeight(): number {
    return this._window.innerHeight;
  }

  pageXOffset(): number {
    return this._window.pageXOffset;
  }

  pageYOffset(): number {
    return this._window.pageYOffset;
  }
}