import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  isProcessing: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  login() {
    if (!this.authService.user$) {
      this.isProcessing = true;
      this.authService.login().finally(() => {
        this.isProcessing = false;
      });
    } else {
      this.router.navigateByUrl('/');
      this.snackBar.open('すでにログインしています', null, { duration: 2000 });
    }
  }
}
