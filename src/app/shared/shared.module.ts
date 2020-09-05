import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';

import { ArticleCardComponent } from './article-card/article-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ArticleEditButtonsComponent } from './article-edit-buttons/article-edit-buttons.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    ArticleCardComponent,
    DeleteDialogComponent,
    ArticleEditButtonsComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
  ],
  exports: [
    ArticleCardComponent,
    DeleteDialogComponent,
    ArticleEditButtonsComponent,
    NotFoundComponent,
  ],
})
export class SharedModule { }
