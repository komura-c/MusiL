import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceStub } from 'src/test/service.stub';
import { LoginDialogComponent } from './login-dialog.component';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  const MatDialogRefStub = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [MatDialogModule, LoginDialogComponent],
    providers: [
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: MatDialogRef, useValue: MatDialogRefStub },
    ],
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
