import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchResultRoutingModule } from './search-result-routing.module';
import { SearchResultComponent } from './search-result/search-result.component';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { SharedArticleCardModule } from '../shared-article-card/shared-article-card.module';

@NgModule({
    imports: [
        CommonModule,
        SearchResultRoutingModule,
        MatPaginatorModule,
        SharedArticleCardModule,
        MatProgressSpinnerModule,
        SearchResultComponent,
    ],
})
export class SearchResultModule {}
