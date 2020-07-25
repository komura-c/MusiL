import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserData } from '@interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageCropDialogComponent } from '../image-crop-dialog/image-crop-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  uid = this.authService.uid;
  user$: Observable<UserData> = this.authService.user$.pipe(
    tap(() => this.loadingService.toggleLoading(false))
  );

  form = this.fb.group({
    avatarURL: [''],
    userName: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(160)]],
  });

  get avatarURLControl() {
    return this.form.get('avatarURL') as FormControl;
  }

  get userNameControl() {
    return this.form.get('userName') as FormControl;
  }

  get descriptionControl() {
    return this.form.get('description') as FormControl;
  }

  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.loadingService.toggleLoading(true);
    this.subscription = this.user$.subscribe((user: UserData) => {
      this.form.patchValue({
        avatarURL: user.avatarURL,
        userName: user.userName,
        description: user.description,
      });
    });
  }

  ngOnInit(): void {
  }

  openImageCropDialog(event: any, imageSelecter: any) {
    this.dialog.open(ImageCropDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: { event, imageSelecter },
    });
  }

  saveProfile(): void {

  }

  deleteAccount(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
