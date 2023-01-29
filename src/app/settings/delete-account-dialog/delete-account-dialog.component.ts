import { Component } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { UserService } from 'src/app/services/user.service';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.scss'],
})
export class DeleteAccountDialogComponent {
  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    private router: Router,
    private dialogRef: MatDialogRef<DeleteAccountDialogComponent>
  ) {}

  deleteAccount() {
    this.dialogRef.close();
    this.userService
      .deleteUser()
      .then(() => {
        this.router.navigateByUrl('/');
        this.snackBar.open(
          'アカウントが削除されました。ご利用ありがとうございました。',
          '閉じる'
        );
      })
      .catch(() => {
        this.snackBar.open(
          '削除に失敗しました。再度ログインしてお試しください。',
          '閉じる'
        );
      });
  }
}
