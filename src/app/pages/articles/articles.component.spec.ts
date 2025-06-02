import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceStub, ArticleServiceStub } from 'src/test/service.stub';
import { getCommonProviders } from 'src/test/test-helpers';
import ArticlesComponent from './articles.component';

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ArticlesComponent],
      providers: [
        ...getCommonProviders(),
        { provide: ArticleService, useValue: ArticleServiceStub },
        { provide: AuthService, useValue: AuthServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
