import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AuthServiceStub, UserServiceStub } from 'src/test/service.stub';
import { getCommonProviders } from 'src/test/test-helpers';
import { DeleteAccountDialogComponent } from './delete-account-dialog.component';

describe('DeleteAccountDialogComponent', () => {
  let component: DeleteAccountDialogComponent;
  let fixture: ComponentFixture<DeleteAccountDialogComponent>;
  const MatDialogRefStub = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, DeleteAccountDialogComponent],
      providers: [
        ...getCommonProviders(),
        MatSnackBar,
        Overlay,
        { provide: MatDialogRef, useValue: MatDialogRefStub },
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: UserService, useValue: UserServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountDialogComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
