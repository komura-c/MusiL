import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';

import { ArticleComponent } from './article/article.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { NoteEditButtonsComponent } from './note-edit-buttons/note-edit-buttons.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    ArticleComponent,
    DeleteDialogComponent,
    NoteEditButtonsComponent,
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
  exports: [ArticleComponent, DeleteDialogComponent, NoteEditButtonsComponent,
    NotFoundComponent],
})
export class SharedModule { }
