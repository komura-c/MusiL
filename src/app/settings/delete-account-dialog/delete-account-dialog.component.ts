import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.scss'],
})
export class DeleteAccountDialogComponent implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    private router: Router,
    private dialogRef: MatDialogRef<DeleteAccountDialogComponent>
  ) { }

  ngOnInit(): void { }

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
