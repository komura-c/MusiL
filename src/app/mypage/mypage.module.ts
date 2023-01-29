import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MypageRoutingModule } from './mypage-routing.module';
import { MypageComponent } from './mypage/mypage.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MyArticlesComponent } from './my-articles/my-articles.component';
import { LikedArticlesComponent } from './liked-articles/liked-articles.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { StringToLinkPipe } from '../pipes/string-to-link.pipe';
import { SharedArticleCardModule } from '../shared-article-card/shared-article-card.module';
import { SharedArticleEditModule } from '../shared-article-edit/shared-article-edit.module';
import { ArticleCommentComponent } from './article-comment/article-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatDividerModule } from '@angular/material/divider';
import { SharedLoginDialogModule } from '../shared-login-dialog/shared-login-dialog.module';
import { RecommendArticleComponent } from './recommend-article/recommend-article.component';
import { EncodeUrlPipe } from '../pipes/encode-url.pipe';
import { SafeHTMLPipe } from '../pipes/safe-html.pipe';

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
    SafeHTMLPipe,
  ],
  imports: [
    CommonModule,
    MypageRoutingModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    SharedArticleCardModule,
    SharedArticleEditModule,
    MatTabsModule,
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
