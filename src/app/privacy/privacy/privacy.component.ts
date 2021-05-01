import { Component } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent {
  constructor(private seoService: SeoService) {
    this.seoService.updateTitleAndMeta({
      title: 'プライバシーポリシー | MusiL',
      description: 'サービスのプライバシーポリシーページです',
    });
    this.seoService.createLinkTagForCanonicalURL();
  }
}
