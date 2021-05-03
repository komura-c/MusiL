import { Component } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  constructor(private seoService: SeoService) {
    this.seoService.updateTitleAndMeta({
      title: 'ページが見つかりません | MusiL',
      description:
        'お探しのページは、削除されたかURLが変更された可能性があります。',
    });
    this.seoService.createLinkTagForCanonicalURL(environment.hostingURL);
  }
}
