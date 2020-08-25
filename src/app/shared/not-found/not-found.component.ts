import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  constructor(private seoService: SeoService) {
    const metaTags = {
      title: null,
      description: null,
      ogType: null,
      ogImage: null,
      twitterCard: null,
    };
    this.seoService.setTitleAndMeta(metaTags);
  }

  ngOnInit(): void {}
}
