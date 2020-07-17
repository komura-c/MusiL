import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';

import { ArticleComponent } from './article/article.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@NgModule({
  declarations: [ArticleComponent, DeleteDialogComponent],
  imports: [CommonModule, SharedRoutingModule, MatButtonModule, MatDialogModule],
  exports: [ArticleComponent, DeleteDialogComponent],
})
export class SharedModule { }
