import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_SCROLL_STRATEGY,
} from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AuthServiceStub, UserServiceStub } from 'src/test/service.stub';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SettingsComponent],
        providers: [
          FormBuilder,
          MatDialog,
          Overlay,
          MAT_DIALOG_SCROLL_STRATEGY,
          { provide: AuthService, useValue: AuthServiceStub },
          { provide: UserService, useValue: UserServiceStub },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
