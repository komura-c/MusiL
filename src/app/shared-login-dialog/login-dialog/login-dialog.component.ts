import { Component } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MatLegacyDialogModule,
} from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  standalone: true,
  imports: [MatLegacyDialogModule, MatLegacyButtonModule, MatIconModule],
})
export class LoginDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    public authService: AuthService,
    private router: Router
  ) {}

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
