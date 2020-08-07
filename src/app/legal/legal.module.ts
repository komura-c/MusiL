import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegalRoutingModule } from './legal-routing.module';
import { LegalComponent } from './legal/legal.component';

@NgModule({
  declarations: [LegalComponent],
  imports: [CommonModule, LegalRoutingModule],
})
export class LegalModule {}
