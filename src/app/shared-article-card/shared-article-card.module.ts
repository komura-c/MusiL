import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedArticleCardRoutingModule } from './shared-article-card-routing.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { ArticleCardComponent } from './article-card/article-card.component';
import { ArticleCardSkeltonComponent } from './article-card-skelton/article-card-skelton.component';

@NgModule({
  declarations: [ArticleCardComponent, ArticleCardSkeltonComponent],
  imports: [
    CommonModule,
    SharedArticleCardRoutingModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [ArticleCardComponent, ArticleCardSkeltonComponent],
})
export class SharedArticleCardModule {}
