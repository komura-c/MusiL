import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikesArticleComponent } from './likes-article.component';

describe('LikesArticleComponent', () => {
  let component: LikesArticleComponent;
  let fixture: ComponentFixture<LikesArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikesArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikesArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
