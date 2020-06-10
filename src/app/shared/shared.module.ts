import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from './article/article.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ArticleComponent],
  imports: [CommonModule, MatCardModule],
  exports: [ArticleComponent],
})
export class SharedModule {}
