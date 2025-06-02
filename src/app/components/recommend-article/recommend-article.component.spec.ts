import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';
import { ArticleServiceStub, UserServiceStub } from 'src/test/service.stub';
import { getCommonProviders } from 'src/test/test-helpers';
import { RecommendArticleComponent } from './recommend-article.component';

describe('RecommendArticleComponent', () => {
  let component: RecommendArticleComponent;
  let fixture: ComponentFixture<RecommendArticleComponent>;

  beforeAll(() => {
    // Ensure global document has defaultView for @HostListener
    if (!document.defaultView) {
      Object.defineProperty(document, 'defaultView', {
        value: window,
        writable: true,
        configurable: true,
      });
    }
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RecommendArticleComponent],
      providers: [
        ...getCommonProviders(),
        { provide: ArticleService, useValue: ArticleServiceStub },
        { provide: UserService, useValue: UserServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendArticleComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
