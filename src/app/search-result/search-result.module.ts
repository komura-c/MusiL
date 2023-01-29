import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchResultRoutingModule } from './search-result-routing.module';
import { SearchResultComponent } from './search-result/search-result.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArticleCardComponent } from '../components/article-card/article-card.component';
import { ArticleCardSkeltonComponent } from '../components/article-card-skelton/article-card-skelton.component';

@NgModule({
  declarations: [SearchResultComponent],
  imports: [
    CommonModule,
    SearchResultRoutingModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ArticleCardComponent,
    ArticleCardSkeltonComponent,
  ],
})
export class SearchResultModule {}
