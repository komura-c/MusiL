import { Component } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef as MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-link-insert-dialog',
  templateUrl: './link-insert-dialog.component.html',
  styleUrls: ['./link-insert-dialog.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatDialogModule,
    MatButtonModule,
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
