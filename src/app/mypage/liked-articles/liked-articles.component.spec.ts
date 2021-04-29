import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LikedArticlesComponent } from './liked-articles.component';

describe('LikedArticlesComponent', () => {
  let component: LikedArticlesComponent;
  let fixture: ComponentFixture<LikedArticlesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LikedArticlesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
