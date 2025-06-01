import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SeoService } from 'src/app/services/seo.service';
import { ArticleServiceStub, AuthServiceStub, UserServiceStub } from 'src/test/service.stub';
import { getCommonProviders } from 'src/test/test-helpers';
import TopComponent from './top.component';

describe('TopComponent', () => {
  let component: TopComponent;
  let fixture: ComponentFixture<TopComponent>;

  beforeAll(() => {
    // Ensure global document has defaultView for @HostListener
    if (!document.defaultView) {
      Object.defineProperty(document, 'defaultView', {
        value: window,
        writable: true,
        configurable: true
      });
    }
  });

  const SeoServiceStub = {
    updateTitleAndMeta: jasmine.createSpy('updateTitleAndMeta'),
    createLinkTagForCanonicalURL: jasmine.createSpy('createLinkTagForCanonicalURL'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TopComponent],
      providers: [
        ...getCommonProviders(),
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: UserService, useValue: UserServiceStub },
        { provide: ArticleService, useValue: ArticleServiceStub },
        { provide: SeoService, useValue: SeoServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
