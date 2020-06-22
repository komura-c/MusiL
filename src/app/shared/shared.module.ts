import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from './article/article.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ArticleComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule],
  exports: [ArticleComponent],
})
export class SharedModule { }
