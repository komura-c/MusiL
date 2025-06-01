import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AuthServiceStub, UserServiceStub } from 'src/test/service.stub';
import { getCommonProviders } from 'src/test/test-helpers';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [
        ...getCommonProviders(),
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: UserService, useValue: UserServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
