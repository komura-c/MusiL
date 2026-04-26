import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { tap } from 'rxjs/operators';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, AsyncPipe } from '@angular/common';
import { SearchInputComponent } from 'src/app/components/search-input/search-input.component';
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
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
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
