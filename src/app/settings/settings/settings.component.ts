import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from '@interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { take } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import {
  MatLegacyDialogModule,
  MatLegacyDialog as MatDialog,
} from '@angular/material/legacy-dialog';
import { ImageCropDialogComponent } from '../image-crop-dialog/image-crop-dialog.component';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';
import { Router } from '@angular/router';
import { SeoService } from 'src/app/services/seo.service';
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatIconModule,
    ReactiveFormsModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MatLegacyButtonModule,
    MatLegacyProgressSpinnerModule,
    AsyncPipe,
    MatLegacyDialogModule,
  ],
})
export default class SettingsComponent implements OnInit {
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
    return this.form.get('userName') as UntypedFormControl;
  }

  get descriptionControl() {
    return this.form.get('description') as UntypedFormControl;
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private seoService: SeoService
  ) {
    this.seoService.updateTitleAndMeta({
      title: 'アカウント設定 | MusiL',
      description: 'アカウント設定のページです',
    });
    this.seoService.createLinkTagForCanonicalURL();
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
