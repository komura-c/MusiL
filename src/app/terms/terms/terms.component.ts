import { Component } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent {
  constructor(private seoService: SeoService) {
    this.seoService.updateTitleAndMeta({
      title: '利用規約 | MusiL',
      description: 'サービスの利用規約ページです',
    });
    this.seoService.createLinkTagForCanonicalURL();
  }
}
