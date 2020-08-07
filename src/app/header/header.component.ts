import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user$ = this.authService.user$.pipe(tap(() => (this.isUser = true)));
  isProcessing: boolean;
  isUser: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  login() {
    this.isProcessing = true;
    this.authService.login().finally(() => {
      this.isProcessing = false;
    });
  }

  logout() {
    this.isProcessing = true;
    this.authService.logout().finally(() => {
      this.isProcessing = false;
    });
  }
}
