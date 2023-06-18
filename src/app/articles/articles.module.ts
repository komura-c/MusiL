import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles/articles.component';
import { CreateComponent } from './create/create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { QuillModule } from 'ngx-quill';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { EditorComponent } from './editor/editor.component';
import { TagFormComponent } from './tag-form/tag-form.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedArticleEditModule } from '../shared-article-edit/shared-article-edit.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LinkInsertDialogComponent } from './link-insert-dialog/link-insert-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

@NgModule({
    imports: [
        CommonModule,
        ArticlesRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        QuillModule.forRoot(),
        MatSlideToggleModule,
        MatIconModule,
        SharedArticleEditModule,
        MatChipsModule,
        MatAutocompleteModule,
        InfiniteScrollModule,
        MatToolbarModule,
        MatDialogModule,
        ArticlesComponent,
        CreateComponent,
        EditorComponent,
        TagFormComponent,
        LinkInsertDialogComponent,
    ],
})
export class ArticlesModule {}
