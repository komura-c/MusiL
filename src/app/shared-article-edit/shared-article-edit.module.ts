import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedArticleEditRoutingModule } from './shared-article-edit-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ArticleEditButtonsComponent } from './article-edit-buttons/article-edit-buttons.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [ArticleEditButtonsComponent, DeleteDialogComponent],
  imports: [
    CommonModule,
    SharedArticleEditRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
  ],
  exports: [ArticleEditButtonsComponent, DeleteDialogComponent],
})
export class SharedArticleEditModule {}
