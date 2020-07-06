import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$ = this.authService.user$;
  isProcessing: boolean;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.isProcessing = true;
    this.authService.login().finally(() => {
      this.isProcessing = false;
    });
  }

  logout() {
    this.authService.logout();
  }
}
