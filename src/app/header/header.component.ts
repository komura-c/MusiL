import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$ = this.authService.afUser$;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
