import { Injectable } from '@angular/core';
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

  constructor(private meta: Meta, private title: Title) {}

  setTitleAndMeta(metaTags: {
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
    this.meta.addTags([
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
    ]);
  }
}
