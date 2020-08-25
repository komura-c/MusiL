import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit {
  constructor(private seoService: SeoService) {
    const metaTags = {
      title: 'プライバシーポリシー | MusiL',
      description: 'サービスのプライバシーポリシーページです',
      ogType: null,
      ogImage: null,
      twitterCard: null,
    };
    this.seoService.setTitleAndMeta(metaTags);
  }

  ngOnInit(): void {}
}
