import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

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
    private userService: UserService,
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.isProcessing = true;
    this.authService.login().finally(() => {
      this.isProcessing = false;
      this.userService.getUserByUId(this.authService.uId);
    });
  }

  logout() {
    this.authService.logout();
  }
}
