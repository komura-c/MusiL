import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes/notes.component';
import { CreateComponent } from './create/create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FroalaViewModule, FroalaEditorModule } from 'angular-froala-wysiwyg';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [NotesComponent, CreateComponent],
  imports: [
    CommonModule,
    NotesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FroalaEditorModule,
    FroalaViewModule,
    MatSlideToggleModule,
  ],
})
export class NotesModule { }
