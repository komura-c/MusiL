import { Component } from '@angular/core';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import {
  MatDialogRef as MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DeleteAccountDialogComponent {
  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<DeleteAccountDialogComponent>
  ) {}

  deleteAccount() {
    this.dialogRef.close();
    this.authService
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
