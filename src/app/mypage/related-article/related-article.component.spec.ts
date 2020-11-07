import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedArticleComponent } from './related-article.component';

describe('RelatedArticleComponent', () => {
  let component: RelatedArticleComponent;
  let fixture: ComponentFixture<RelatedArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RelatedArticleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
