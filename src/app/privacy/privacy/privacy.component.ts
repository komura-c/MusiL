import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit {
  constructor(private title: Title) {
    this.title.setTitle('プライバシーポリシー | MusiL');
  }

  ngOnInit(): void {}
}
