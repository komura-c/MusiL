export class MockDocumentService {
  private _document = {
    body: document.createElement('body'),
    head: document.createElement('head'),
    documentElement: document.createElement('html'),
    location: { href: 'http://localhost:4200' },
    title: 'Test Title',
    cookie: 'test=value'
  };

  get nativeDocument() {
    return this._document as any;
  }

  get body() {
    return this._document.body;
  }

  get head() {
    return this._document.head;
  }

  get documentElement() {
    return this._document.documentElement;
  }

  get location() {
    return this._document.location;
  }

  get title() {
    return this._document.title;
  }

  set title(value: string) {
    this._document.title = value;
  }

  getElementById = jasmine.createSpy('getElementById').and.returnValue(null);
  getElementsByClassName = jasmine.createSpy('getElementsByClassName').and.returnValue([]);
  getElementsByTagName = jasmine.createSpy('getElementsByTagName').and.returnValue([]);
  querySelector = jasmine.createSpy('querySelector').and.returnValue(null);
  querySelectorAll = jasmine.createSpy('querySelectorAll').and.returnValue([]);
  createElement = jasmine.createSpy('createElement').and.callFake((tagName: string) => {
    return document.createElement(tagName);
  });
  createTextNode = jasmine.createSpy('createTextNode').and.callFake((data: string) => {
    return document.createTextNode(data);
  });
  createDocumentFragment = jasmine.createSpy('createDocumentFragment').and.returnValue(
    document.createDocumentFragment()
  );
  addEventListener = jasmine.createSpy('addEventListener');
  removeEventListener = jasmine.createSpy('removeEventListener');
  dispatchEvent = jasmine.createSpy('dispatchEvent').and.returnValue(true);
  createEvent = jasmine.createSpy('createEvent').and.returnValue(new Event('test'));
  execCommand = jasmine.createSpy('execCommand').and.returnValue(true);
  hasFocus = jasmine.createSpy('hasFocus').and.returnValue(true);
  getSelection = jasmine.createSpy('getSelection').and.returnValue(null);

  cookie(): string {
    return this._document.cookie;
  }

  setCookie(value: string): void {
    this._document.cookie = value;
  }

  createRange = jasmine.createSpy('createRange').and.returnValue({} as Range);
  adoptNode = jasmine.createSpy('adoptNode').and.callFake((node: Node) => node);
  importNode = jasmine.createSpy('importNode').and.callFake((node: Node) => node);
  elementFromPoint = jasmine.createSpy('elementFromPoint').and.returnValue(null);
  caretPositionFromPoint = jasmine.createSpy('caretPositionFromPoint').and.returnValue(null);
  createNodeIterator = jasmine.createSpy('createNodeIterator').and.returnValue({} as NodeIterator);
  createTreeWalker = jasmine.createSpy('createTreeWalker').and.returnValue({} as TreeWalker);
}