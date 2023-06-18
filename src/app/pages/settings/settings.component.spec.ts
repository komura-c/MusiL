import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  MatLegacyDialog as MatDialog,
  MAT_LEGACY_DIALOG_SCROLL_STRATEGY as MAT_DIALOG_SCROLL_STRATEGY,
} from '@angular/material/legacy-dialog';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AuthServiceStub, UserServiceStub } from 'src/test/service.stub';
import SettingsComponent from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        UntypedFormBuilder,
        MatDialog,
        Overlay,
        MAT_DIALOG_SCROLL_STRATEGY,
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: UserService, useValue: UserServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
