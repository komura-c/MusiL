import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckRoutingModule } from './check-routing.module';
import { CheckComponent } from './check/check.component';

@NgModule({
  declarations: [CheckComponent],
  imports: [CommonModule, CheckRoutingModule],
})
export class CheckModule {}
