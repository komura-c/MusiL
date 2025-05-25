import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthServiceStub, UserServiceStub } from 'src/test/service.stub';
import { UserService } from 'src/app/services/user.service';
import MypageComponent from './mypage.component';
import { AuthService } from 'src/app/services/auth.service';
import { StringToLinkPipe } from 'src/app/pipes/string-to-link.pipe';

describe('MypageComponent', () => {
  let component: MypageComponent;
  let fixture: ComponentFixture<MypageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MypageComponent, StringToLinkPipe],
      providers: [
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: UserService, useValue: UserServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
