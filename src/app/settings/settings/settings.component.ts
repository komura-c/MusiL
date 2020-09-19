import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from '@interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageCropDialogComponent } from '../image-crop-dialog/image-crop-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';
import { Router } from '@angular/router';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  user$: Observable<UserData> = this.authService.user$;
  userNameMaxLength = 50;
  descriptionMaxLength = 160;
  form = this.fb.group({
    userName: [
      '',
      [Validators.required, Validators.maxLength(this.userNameMaxLength)],
    ],
    description: ['', [Validators.maxLength(this.descriptionMaxLength)]],
  });

  get userNameControl() {
    return this.form.get('userName') as FormControl;
  }

  get descriptionControl() {
    return this.form.get('description') as FormControl;
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private seoService: SeoService
  ) {
    this.loadingService.toggleLoading(true);
    this.seoService.setTitleAndMeta({
      title: 'アカウント設定 | MusiL',
      description: 'アカウント設定のページです',
    });
  }

  ngOnInit(): void {
    this.user$
      .pipe(take(1))
      .toPromise()
      .then((user: UserData) => {
        this.form.patchValue({
          userName: user.userName,
          description: user.description,
        });
        this.loadingService.toggleLoading(false);
      });
  }

  openImageCropDialog(event: any, imageSelecter: any): void {
    this.dialog.open(ImageCropDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: { event, imageSelecter },
    });
  }

  changeProfile(screenName: string): void {
    const formData = this.form.value;
    const newUserData: Pick<UserData, 'userName' | 'description'> = {
      userName: formData.userName,
      description: formData.description,
    };
    this.userService.changeUserData(this.authService.uid, newUserData);
    this.router.navigateByUrl('/' + screenName);
    this.snackBar.open('プロフィールが更新されました', '閉じる');
  }

  openDeleteAccountDialog(): void {
    this.dialog.open(DeleteAccountDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
