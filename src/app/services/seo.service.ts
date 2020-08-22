import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(private meta: Meta, private title: Title) { }

  setTitleAndMeta(metaTags: { title: string, description: string, ogType: string, ogImage: string, twitterCard: string }) {
    this.title.setTitle(metaTags.title);
    this.meta.addTags([
      { name: 'description', content: metaTags.description },
      { property: 'og:title', content: metaTags.title },
      { property: 'og:description', content: metaTags.description },
      { property: 'og:type', content: metaTags.ogType },
      { property: 'og:url', content: location.href },
      { property: 'og:image', content: metaTags.ogImage },
      { name: 'twitter:card', content: metaTags.twitterCard },
    ]);
  }
}
