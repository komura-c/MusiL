import { Component } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { environment } from 'src/environments/environment';
import { RouterLink } from '@angular/router';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: true,
  imports: [MatLegacyButtonModule, RouterLink],
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
