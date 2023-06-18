import { Component } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { NgIf } from '@angular/common';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';

@Component({
    selector: 'app-link-insert-dialog',
    templateUrl: './link-insert-dialog.component.html',
    styleUrls: ['./link-insert-dialog.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatLegacyFormFieldModule,
        MatLegacyInputModule,
        NgIf,
        MatLegacyDialogModule,
        MatLegacyButtonModule,
    ],
})
export class LinkInsertDialogComponent {
  form = this.fb.group({
    linkInput: ['', [Validators.required, this.linkValidator]],
    linkText: [''],
  });

  get linkInputControl() {
    return this.form.get('linkInput') as UntypedFormControl;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<LinkInsertDialogComponent>
  ) {}

  linkValidator(formControl: AbstractControl): { linkValidator: boolean } {
    const linkURL: string = formControl.value;
    if (!linkURL) {
      return null;
    }
    return /http(s)?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+/gi.test(linkURL)
      ? null
      : { linkValidator: true };
  }

  onInsertLink() {
    this.dialogRef.close(this.form.value);
  }
}
