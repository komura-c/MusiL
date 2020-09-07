import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MypageRoutingModule } from './mypage-routing.module';
import { MypageComponent } from './mypage/mypage.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { FroalaViewModule } from 'angular-froala-wysiwyg';
import { MatChipsModule } from '@angular/material/chips';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MyArticlesComponent } from './my-articles/my-articles.component';
import { LikedArticlesComponent } from './liked-articles/liked-articles.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StringToLinkPipe } from '../pipes/string-to-link.pipe';

@NgModule({
  declarations: [
    MypageComponent,
    ArticleDetailComponent,
    MyArticlesComponent,
    LikedArticlesComponent,
    StringToLinkPipe,
  ],
  imports: [
    CommonModule,
    MypageRoutingModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    SharedModule,
    MatTabsModule,
    FroalaViewModule,
    MatChipsModule,
    ClipboardModule,
    MatProgressSpinnerModule,
  ],
})
export class MypageModule {}
