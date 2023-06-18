import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecommendArticleComponent } from './recommend-article.component';

describe('RecommendArticleComponent', () => {
  let component: RecommendArticleComponent;
  let fixture: ComponentFixture<RecommendArticleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RecommendArticleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
