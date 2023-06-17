import { Component, Inject } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-image-crop-dialog',
  templateUrl: './image-crop-dialog.component.html',
  styleUrls: ['./image-crop-dialog.component.scss'],
})
export class ImageCropDialogComponent {
  imageChangedEvent = '';
  croppedImage = '';
  imageSelecter: any;

  isLoading: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: any; imageSelecter: any },
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ImageCropDialogComponent>,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.isLoading = true;
    this.imageChangedEvent = this.data.event;
    this.imageSelecter = this.data.imageSelecter;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.isLoading = false;
  }

  loadImageFailed() {
    this.dialogRef.close();
    this.snackBar.open('画像の読み込みに失敗しました', '閉じる');
  }

  resetInput() {
    this.imageChangedEvent = '';
    this.imageSelecter.value = '';
    this.dialogRef.close();
  }

  changeAvatar() {
    if (this.croppedImage) {
      this.dialogRef.close();
      this.userService
        .uploadAvatar(this.authService.uid, this.croppedImage)
        .then(() => {
          this.imageChangedEvent = '';
          this.imageSelecter.value = '';
          this.snackBar.open('画像を変更しました。', '閉じる');
        });
    }
  }
}
