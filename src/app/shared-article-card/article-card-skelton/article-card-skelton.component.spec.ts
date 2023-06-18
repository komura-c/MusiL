import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCardSkeltonComponent } from './article-card-skelton.component';

describe('ArticleCardSkeltonComponent', () => {
  let component: ArticleCardSkeltonComponent;
  let fixture: ComponentFixture<ArticleCardSkeltonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ArticleCardSkeltonComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardSkeltonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
