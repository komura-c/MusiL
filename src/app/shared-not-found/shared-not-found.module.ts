import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedNotFoundRoutingModule } from './shared-not-found-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, SharedNotFoundRoutingModule, MatButtonModule],
  exports: [NotFoundComponent],
})
export class SharedNotFoundModule {}
