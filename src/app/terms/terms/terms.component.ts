import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {
  constructor(private seoService: SeoService) {
    const metaTags = {
      title: '利用規約 | MusiL',
      description: 'サービスの利用規約ページです',
      ogType: null,
      ogImage: null,
      twitterCard: null,
    };
    this.seoService.setTitleAndMeta(metaTags);
  }

  ngOnInit(): void {}
}
