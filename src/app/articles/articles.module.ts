import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles/articles.component';
import { CreateComponent } from './create/create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EditorComponent } from './editor/editor.component';
import { TagFormComponent } from './tag-form/tag-form.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedArticleEditModule } from '../shared-article-edit/shared-article-edit.module';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    ArticlesComponent,
    CreateComponent,
    EditorComponent,
    TagFormComponent,
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FroalaEditorModule,
    MatSlideToggleModule,
    MatIconModule,
    SharedArticleEditModule,
    MatChipsModule,
    MatAutocompleteModule,
    InfiniteScrollModule,
    MatToolbarModule,
  ],
})
export class ArticlesModule {}
