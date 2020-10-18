import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedArticleCardRoutingModule } from './shared-article-card-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ArticleCardComponent } from './article-card/article-card.component';

@NgModule({
  declarations: [ArticleCardComponent],
  imports: [
    CommonModule,
    SharedArticleCardRoutingModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [ArticleCardComponent],
})
export class SharedArticleCardModule {}
