import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedLoginDialogRoutingModule } from './shared-login-dialog-routing.module';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [LoginDialogComponent],
  imports: [
    CommonModule,
    SharedLoginDialogRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [LoginDialogComponent],
})
export class SharedLoginDialogModule {}
