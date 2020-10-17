import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchResultRoutingModule } from './search-result-routing.module';
import { SearchResultComponent } from './search-result/search-result.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '../shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [SearchResultComponent],
  imports: [
    CommonModule,
    SearchResultRoutingModule,
    MatPaginatorModule,
    SharedModule,
    MatProgressSpinnerModule,
  ],
})
export class SearchResultModule {}
