import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopRoutingModule } from './top-routing.module';
import { TopComponent } from './top/top.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedArticleCardModule } from '../shared-article-card/shared-article-card.module';

@NgModule({
  declarations: [TopComponent, WelcomeComponent],
  imports: [
    CommonModule,
    TopRoutingModule,
    SharedArticleCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class TopModule {}
