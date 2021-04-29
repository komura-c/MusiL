import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MypageComponent } from './mypage.component';

describe('MypageComponent', () => {
  let component: MypageComponent;
  let fixture: ComponentFixture<MypageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MypageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
