import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { getCommonProviders } from 'src/test/test-helpers';
import { RecommendArticleComponent } from './recommend-article.component';

describe('RecommendArticleComponent', () => {
  let component: RecommendArticleComponent;
  let fixture: ComponentFixture<RecommendArticleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RecommendArticleComponent],
      providers: [...getCommonProviders()],
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
