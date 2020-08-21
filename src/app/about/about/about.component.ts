import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  isProcessing: boolean;
  user$ = this.authService.user$;

  constructor(private authService: AuthService, private title: Title) {
    this.title.setTitle('MusiLについて | MusiL');
  }

  ngOnInit(): void {}

  login() {
    this.isProcessing = true;
    this.authService.login().finally(() => {
      this.isProcessing = false;
    });
  }
}
