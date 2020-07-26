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
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  uid = this.authService.uid;
  screenName: string;
  user$: Observable<UserData> = this.authService.user$.pipe(
    tap((user) => this.screenName = user.screenName),
    tap(() => this.loadingService.toggleLoading(false))
  );

  form = this.fb.group({
    userName: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(160)]],
  });

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
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.loadingService.toggleLoading(true);
    this.subscription = this.user$.subscribe((user: UserData) => {
      this.form.patchValue({
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

  changeProfile() {
    const formData = this.form.value;
    const newUserData: Pick<UserData, 'userName' | 'description'> = {
      userName: formData.userName,
      description: formData.description,
    };
    this.userService.changeUserData(this.uid, newUserData);
    this.router.navigateByUrl('/' + this.screenName);
    this.snackBar.open('プロフィールが更新されました', '閉じる', { duration: 5000 });
  }

  openDeleteAccountDialog() {
    this.dialog.open(DeleteAccountDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
