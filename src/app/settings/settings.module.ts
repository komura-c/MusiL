import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropDialogComponent } from './image-crop-dialog/image-crop-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    SettingsComponent,
    ImageCropDialogComponent,
    DeleteAccountDialogComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatIconModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ImageCropperModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
})
export class SettingsModule {}
