import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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
    return this.form.get('linkInput') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
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