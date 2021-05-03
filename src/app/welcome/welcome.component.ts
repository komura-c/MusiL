import { Component, isDevMode } from '@angular/core';
import { UserData } from '@interfaces/user';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  user$: Observable<UserData> = this.authService.user$.pipe(
    tap(() => { this.isUserLoading = false })
  );
  isUserLoading: boolean;
  helpURL = isDevMode ? "AYgq1MiWksA2LIxP91kG" : "2a3zmsUlRyIGzV4wnkil";

  constructor(
    public authService: AuthService) {
    this.isUserLoading = true;
  }

  login() {
    this.authService.loginProcessing = true;
    this.authService.login().finally(() => {
      this.authService.loginProcessing = false;
    });
  }
}
