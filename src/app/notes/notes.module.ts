import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes/notes.component';
import { CreateComponent } from './create/create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EditorComponent } from './editor/editor.component';
import { TagFormComponent } from './tag-form/tag-form.component';

@NgModule({
  declarations: [
    NotesComponent,
    CreateComponent,
    EditorComponent,
    TagFormComponent,
  ],
  imports: [
    CommonModule,
    NotesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FroalaEditorModule,
    MatSlideToggleModule,
    MatIconModule,
    SharedModule,
    MatChipsModule,
    MatAutocompleteModule,
  ],
})
export class NotesModule {}
