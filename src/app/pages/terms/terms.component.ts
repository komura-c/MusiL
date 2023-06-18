import { Component } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export default class TermsComponent {
  constructor(private seoService: SeoService) {
    this.seoService.updateTitleAndMeta({
      title: '利用規約 | MusiL',
      description: 'サービスの利用規約ページです',
    });
    this.seoService.createLinkTagForCanonicalURL();
  }
}
