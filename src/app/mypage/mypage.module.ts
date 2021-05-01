import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MypageRoutingModule } from './mypage-routing.module';
import { MypageComponent } from './mypage/mypage.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FroalaViewModule } from 'angular-froala-wysiwyg';
import { MatChipsModule } from '@angular/material/chips';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MyArticlesComponent } from './my-articles/my-articles.component';
import { LikedArticlesComponent } from './liked-articles/liked-articles.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StringToLinkPipe } from '../pipes/string-to-link.pipe';
import { SharedArticleCardModule } from '../shared-article-card/shared-article-card.module';
import { SharedArticleEditModule } from '../shared-article-edit/shared-article-edit.module';
import { SharedNotFoundModule } from '../shared-not-found/shared-not-found.module';
import { ArticleCommentComponent } from './article-comment/article-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { SharedLoginDialogModule } from '../shared-login-dialog/shared-login-dialog.module';
import { RecommendArticleComponent } from './recommend-article/recommend-article.component';
import { EncodeUrlPipe } from '../pipes/encode-url.pipe';

@NgModule({
  declarations: [
    MypageComponent,
    ArticleDetailComponent,
    MyArticlesComponent,
    LikedArticlesComponent,
    StringToLinkPipe,
    ArticleCommentComponent,
    RecommendArticleComponent,
    EncodeUrlPipe,
  ],
  imports: [
    CommonModule,
    MypageRoutingModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    SharedArticleCardModule,
    SharedArticleEditModule,
    SharedNotFoundModule,
    MatTabsModule,
    FroalaViewModule,
    MatChipsModule,
    ClipboardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    SharedLoginDialogModule,
  ],
})
export class MypageModule {}
