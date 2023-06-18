import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropDialogComponent } from './image-crop-dialog/image-crop-dialog.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

@NgModule({
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
        SettingsComponent,
        ImageCropDialogComponent,
        DeleteAccountDialogComponent,
    ],
})
export class SettingsModule {}
