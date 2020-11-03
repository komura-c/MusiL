import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  constructor(private seoService: SeoService) {
    this.seoService.updateTitleAndMeta({
      title: 'ページが見つかりません | MusiL',
      description:
        'お探しのページは、削除されたかURLが変更された可能性があります。',
    });
  }

  ngOnInit(): void {}
}
