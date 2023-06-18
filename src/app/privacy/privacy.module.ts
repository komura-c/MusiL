import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyRoutingModule } from './privacy-routing.module';
import { PrivacyComponent } from './privacy/privacy.component';

@NgModule({
  imports: [CommonModule, PrivacyRoutingModule, PrivacyComponent],
})
export class PrivacyModule {}
