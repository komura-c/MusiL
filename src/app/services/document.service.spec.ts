import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DocumentService } from './document.service';


describe('DocumentService', () => {
  let service: DocumentService;
  let mockDocument: any;

  beforeEach(() => {
    mockDocument = {
      body: document.createElement('body'),
      head: document.createElement('head'),
      documentElement: document.createElement('html'),
      location: { href: 'http://localhost' },
      title: 'Test Title',
      getElementById: jasmine.createSpy('getElementById').and.returnValue(null),
      querySelector: jasmine.createSpy('querySelector').and.returnValue(null),
      querySelectorAll: jasmine
        .createSpy('querySelectorAll')
        .and.returnValue([]),
      createElement: jasmine
        .createSpy('createElement')
        .and.returnValue(document.createElement('div')),
      createTextNode: jasmine
        .createSpy('createTextNode')
        .and.returnValue(document.createTextNode('test')),
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      cookie: 'test=value',
      hasFocus: jasmine.createSpy('hasFocus').and.returnValue(true),
      getSelection: jasmine.createSpy('getSelection').and.returnValue(null),
    };

    TestBed.configureTestingModule({
      providers: [
        DocumentService,
        { provide: DOCUMENT, useValue: mockDocument },
      ],
    });
    service = TestBed.inject(DocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return native document', () => {
    expect(service.nativeDocument).toBe(mockDocument);
  });

  it('should provide document properties', () => {
    expect(service.body).toBe(mockDocument.body);
    expect(service.head).toBe(mockDocument.head);
    expect(service.documentElement).toBe(mockDocument.documentElement);
    expect(service.location).toBe(mockDocument.location);
    expect(service.title).toBe('Test Title');
  });

  it('should set document title', () => {
    service.title = 'New Title';
    expect(mockDocument.title).toBe('New Title');
  });

  it('should call document methods', () => {
    service.getElementById('test-id');
    expect(mockDocument.getElementById).toHaveBeenCalledWith('test-id');

    service.querySelector('.test-class');
    expect(mockDocument.querySelector).toHaveBeenCalledWith('.test-class');

    service.createElement('div');
    expect(mockDocument.createElement).toHaveBeenCalledWith('div');

    service.addEventListener('click', () => {
      // Test event listener
    });
    expect(mockDocument.addEventListener).toHaveBeenCalled();
  });

  it('should handle cookie operations', () => {
    expect(service.cookie()).toBe('test=value');

    service.setCookie('new=cookie');
    expect(mockDocument.cookie).toBe('new=cookie');
  });

  it('delegates remaining DOM methods', () => {
    mockDocument.querySelectorAll = vi.fn().mockReturnValue([]);
    mockDocument.createTextNode = vi
      .fn()
      .mockReturnValue(document.createTextNode('x'));
    mockDocument.createDocumentFragment = vi
      .fn()
      .mockReturnValue(document.createDocumentFragment());
    mockDocument.removeEventListener = vi.fn();
    mockDocument.dispatchEvent = vi.fn().mockReturnValue(true);
    mockDocument.createEvent = vi.fn().mockReturnValue({} as Event);
    mockDocument.execCommand = vi.fn().mockReturnValue(true);
    mockDocument.getElementsByClassName = vi.fn().mockReturnValue([]);
    mockDocument.getElementsByTagName = vi.fn().mockReturnValue([]);
    mockDocument.createRange = vi.fn().mockReturnValue({} as Range);
    mockDocument.adoptNode = vi.fn((n: Node) => n);
    mockDocument.importNode = vi.fn((n: Node) => n);
    mockDocument.elementFromPoint = vi.fn().mockReturnValue(null);
    mockDocument.createNodeIterator = vi.fn().mockReturnValue({});
    mockDocument.createTreeWalker = vi.fn().mockReturnValue({});

    expect(service.querySelectorAll('*')).toEqual([]);
    expect(service.createTextNode('x')).toBeTruthy();
    expect(service.createDocumentFragment()).toBeTruthy();
    service.removeEventListener('x', () => undefined);
    expect(service.dispatchEvent(new Event('x'))).toBe(true);
    expect(service.createEvent('Event')).toBeTruthy();
    expect(service.execCommand('copy')).toBe(true);
    expect(service.getElementsByClassName('c')).toEqual([]);
    expect(service.getElementsByTagName('div')).toEqual([]);
    expect(service.hasFocus()).toBe(true);
    expect(service.getSelection()).toBe(null);
    expect(service.createRange()).toBeTruthy();
    expect(service.adoptNode(document.createElement('div'))).toBeTruthy();
    expect(
      service.importNode(document.createElement('div'), false)
    ).toBeTruthy();
    expect(service.elementFromPoint(0, 0)).toBe(null);
    expect(service.createNodeIterator(document.createElement('div'))).toBeTruthy();
    expect(service.createTreeWalker(document.createElement('div'))).toBeTruthy();
  });

  it('caretPositionFromPoint returns null when API unavailable', () => {
    expect(service.caretPositionFromPoint(0, 0)).toBe(null);
  });
});
