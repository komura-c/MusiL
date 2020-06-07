import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    tag: [''],
    text: ['', Validators.required],
  });

  get titleControl() {
    return this.form.get('title') as FormControl;
  }

  get textControl() {
    return this.form.get('text') as FormControl;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
