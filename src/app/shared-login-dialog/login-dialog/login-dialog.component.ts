import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login() {
    this.dialogRef.close();
    this.authService.loginProcessing = true;
    this.authService.login().finally(() => {
      this.authService.loginProcessing = false;
    });
  }

  routerLinkToTerms() {
    this.dialogRef.close();
    this.router.navigateByUrl('/terms');
  }
}
