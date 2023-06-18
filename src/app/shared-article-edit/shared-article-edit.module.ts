import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedArticleEditRoutingModule } from './shared-article-edit-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ArticleEditButtonsComponent } from './article-edit-buttons/article-edit-buttons.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';

@NgModule({
  imports: [
    CommonModule,
    SharedArticleEditRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    ArticleEditButtonsComponent,
    DeleteDialogComponent,
  ],
  exports: [ArticleEditButtonsComponent, DeleteDialogComponent],
})
export class SharedArticleEditModule {}
