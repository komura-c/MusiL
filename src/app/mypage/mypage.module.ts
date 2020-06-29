import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MypageRoutingModule } from './mypage-routing.module';
import { MypageComponent } from './mypage/mypage.component';
import { NoteComponent } from './note/note.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [MypageComponent, NoteComponent],
  imports: [
    CommonModule,
    MypageRoutingModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    SharedModule,
    MatTabsModule,
  ],
})
export class MypageModule { }
