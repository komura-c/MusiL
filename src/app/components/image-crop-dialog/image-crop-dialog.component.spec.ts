import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MatDialog as MatDialog,
  MatDialogRef as MatDialogRef,
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserServiceStub, AuthServiceStub } from 'src/test/service.stub';
import { ImageCropDialogComponent } from './image-crop-dialog.component';
import { getCommonProviders } from 'src/test/test-helpers';

describe('ImageCropDialogComponent', () => {
  let component: ImageCropDialogComponent;
  let fixture: ComponentFixture<ImageCropDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ImageCropDialogComponent],
      providers: [
        ...getCommonProviders(),
        MatDialog,
        { provide: UserService, useValue: UserServiceStub },
        { provide: AuthService, useValue: AuthServiceStub },
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropDialogComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
