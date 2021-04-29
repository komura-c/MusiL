import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArticleEditButtonsComponent } from './article-edit-buttons.component';

describe('ArticleEditButtonsComponent', () => {
  let component: ArticleEditButtonsComponent;
  let fixture: ComponentFixture<ArticleEditButtonsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ArticleEditButtonsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleEditButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
