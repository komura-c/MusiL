import { Component } from '@angular/core';
import { UserData } from '@interfaces/user';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [NgIf, MatLegacyButtonModule, RouterLink, MatIconModule, AsyncPipe],
})
export class WelcomeComponent {
  user$: Observable<UserData> = this.authService.user$.pipe(
    tap(() => {
      this.isUserLoading = false;
    })
  );
  isUserLoading: boolean;
  helpURL = environment.production
    ? '2a3zmsUlRyIGzV4wnkil'
    : 'AYgq1MiWksA2LIxP91kG';

  constructor(public authService: AuthService) {
    this.isUserLoading = true;
  }

  login() {
    this.authService.loginProcessing = true;
    this.authService.login().finally(() => {
      this.authService.loginProcessing = false;
    });
  }
}
