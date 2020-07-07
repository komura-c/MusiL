import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';

import { ArticleComponent } from './article/article.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ArticleComponent],
  imports: [CommonModule, SharedRoutingModule, MatButtonModule],
  exports: [ArticleComponent],
})
export class SharedModule { }
