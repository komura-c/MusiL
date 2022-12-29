import { Component } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-link-insert-dialog',
  templateUrl: './link-insert-dialog.component.html',
  styleUrls: ['./link-insert-dialog.component.scss']
})
export class LinkInsertDialogComponent {
  form = this.fb.group({
    linkInput: [
      '', [Validators.required, this.linkValidator],
    ],
    linkText: [''],
  });

  get linkInputControl() {
    return this.form.get('linkInput') as UntypedFormControl;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<LinkInsertDialogComponent>
  ) { }

  linkValidator(formControl: AbstractControl): { linkValidator: boolean } {
    const linkURL: string = formControl.value;
    if (!linkURL) {
      return null;
    }
    return /http(s)?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+/gi
      .test(linkURL) ? null : { linkValidator: true };
  }

  onInsertLink() {
    this.dialogRef.close(this.form.value);
  }
}
