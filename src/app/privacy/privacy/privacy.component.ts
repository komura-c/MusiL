import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit {
  constructor(private seoService: SeoService) {
    this.seoService.updateTitleAndMeta({
      title: 'プライバシーポリシー | MusiL',
      description: 'サービスのプライバシーポリシーページです',
    });
  }

  ngOnInit(): void {}
}
