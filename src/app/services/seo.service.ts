import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  projectURL = environment.hostingURL;
  readonly notFoundMetas = {
    title: 'ページが見つかりません | MusiL',
    description:
      'お探しのページは、削除されたかURLが変更された可能性があります。',
    ogType: 'article',
    ogImage: environment.hostingURL + 'assets/images/ogp-cover.png',
    twitterCard: 'summary_large_image',
  };

  constructor(private meta: Meta, private title: Title) { }

  setTitleAndMeta(metaTags: {
    title: string;
    description: string;
    ogType: string;
    ogImage: string;
    twitterCard: string;
  }) {
    this.title.setTitle(
      metaTags.title ? metaTags.title : this.notFoundMetas.title
    );
    this.meta.addTags([
      {
        name: 'description',
        content: metaTags.description
          ? metaTags.title
          : this.notFoundMetas.description,
      },
      {
        property: 'og:title',
        content: metaTags.title ? metaTags.title : this.notFoundMetas.title,
      },
      {
        property: 'og:description',
        content: metaTags.description
          ? metaTags.title
          : this.notFoundMetas.description,
      },
      {
        property: 'og:type',
        content: metaTags.ogType ? metaTags.title : this.notFoundMetas.ogType,
      },
      { property: 'og:url', content: location.href },
      {
        property: 'og:image',
        content: metaTags.ogImage ? metaTags.title : this.notFoundMetas.ogImage,
      },
      {
        name: 'twitter:card',
        content: metaTags.twitterCard
          ? metaTags.title
          : this.notFoundMetas.twitterCard,
      },
    ]);
  }
}
