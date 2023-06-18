import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsRoutingModule } from './terms-routing.module';
import { TermsComponent } from './terms/terms.component';

@NgModule({
  imports: [CommonModule, TermsRoutingModule, TermsComponent],
})
export class TermsModule {}
