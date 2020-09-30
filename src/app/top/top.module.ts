import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopRoutingModule } from './top-routing.module';
import { TopComponent } from './top/top.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WelcomeComponent } from './welcome/welcome.component';
import { PickupComponent } from './pickup/pickup.component';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [TopComponent, WelcomeComponent, PickupComponent],
  imports: [
    CommonModule,
    TopRoutingModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    NgxUsefulSwiperModule,
    MatProgressSpinnerModule,
  ],
})
export class TopModule { }
