import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isProcessing: boolean;

  constructor(public authService: AuthService) { }

  ngOnInit(): void { }

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
