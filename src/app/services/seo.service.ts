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
      'MusiLは、DTMや作曲をしている人が気軽に記事などを投稿できるコミュニティです。プラグインの紹介、曲分析など音楽制作に関する知識共有をテーマにしています。',
    ogType: 'article',
  };

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateTitleAndMeta(metaTags: {
    title?: string;
    description?: string;
    ogType?: string;
  }) {
    const descriptionText = metaTags.description
      ?.replace(/\n/g, '')
      .replace(/ /g, '')
      .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
      .replace(
        /(https|http):\/\/firebasestorage\.googleapis\.com(\/.*|\?.*|$)/g,
        ''
      );
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
      { property: 'og:url', content: window.location.href },
    ];
    metaTagsArray.forEach((metaTag) => {
      this.meta.updateTag(metaTag);
    });
  }

  createLinkTagForCanonicalURL(URL?: string) {
    this.refreshLinkTagForCanonicalURL();

    const canonicalURL = URL === undefined ? this.document.URL : URL;
    const linkTag: HTMLLinkElement = this.document.createElement('link');
    linkTag.setAttribute('rel', 'canonical');
    this.document.head.appendChild(linkTag);
    linkTag.setAttribute('href', canonicalURL);
  }

  private refreshLinkTagForCanonicalURL() {
    const links = this.document.head.getElementsByTagName('link');
    Array.from(links).forEach((linkElm) => {
      if (linkElm.getAttribute('rel') === 'canonical') {
        this.document.head.removeChild(linkElm);
      }
    });
  }
}
