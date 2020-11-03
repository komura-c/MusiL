import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  readonly defaultMetas = {
    title: 'MusiL | DTMや作曲の知識記録プラットフォーム',
    description:
      'MusiLはDTMや作曲をしている人が気軽に記事などを投稿できるコミュニティです。',
    ogType: 'article',
  };

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  updateTitleAndMeta(metaTags: {
    title?: string;
    description?: string;
    ogType?: string;
  }) {
    const descriptionMaxLength = 120;
    const descriptionText =
      metaTags.description
        ?.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
        .replace(
          /(https|http):\/\/firebasestorage\.googleapis\.com(\/.*|\?.*|$)/g,
          ''
        )
        .slice(0, descriptionMaxLength) + '…';
    this.title.setTitle(
      metaTags.title ? metaTags.title : this.defaultMetas.title
    );
    const metaTagsArray = [
      {
        name: 'description',
        content: descriptionText
          ? descriptionText
          : this.defaultMetas.description,
      },
      {
        property: 'og:title',
        content: metaTags.title ? metaTags.title : this.defaultMetas.title,
      },
      {
        property: 'og:description',
        content: descriptionText
          ? descriptionText
          : this.defaultMetas.description,
      },
      {
        property: 'og:type',
        content: metaTags.ogType ? metaTags.ogType : this.defaultMetas.ogType,
      },
      { property: 'og:url', content: location.href },
    ];
    metaTagsArray.forEach((metaTag) => {
      this.meta.updateTag(metaTag);
    });
  }

  createLinkForCanonicalURL() {
    const link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.doc.head.appendChild(link);
    link.setAttribute('href', this.doc.URL);
    console.log(this.doc.URL);
  }
}
