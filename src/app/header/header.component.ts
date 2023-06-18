import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyMenuModule } from '@angular/material/legacy-menu';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { NgIf, AsyncPipe } from '@angular/common';
import { SearchInputComponent } from '../search-input/search-input.component';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    RouterLink,
    SearchInputComponent,
    NgIf,
    MatLegacyButtonModule,
    MatIconModule,
    MatLegacyMenuModule,
    MatDividerModule,
    AsyncPipe,
  ],
})
export class HeaderComponent {
  user$ = this.authService.user$.pipe(tap(() => (this.isLoading = false)));
  isLoading: boolean;

  constructor(public authService: AuthService) {
    this.isLoading = true;
  }

  login() {
    this.authService.loginProcessing = true;
    this.authService.login().finally(() => {
      this.authService.loginProcessing = false;
    });
  }

  logout() {
    this.authService.loginProcessing = true;
    this.authService.logout().finally(() => {
      this.authService.loginProcessing = false;
    });
  }
}
