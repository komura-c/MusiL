import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void { }

  submit() {
    const formData = this.form.value;
    this.articleService.createArticle({
      userId: this.authService.uid,
      id: 'n00001',
      thumbnailUrl: 'http://placekitten.com/100/100',
      title: formData.title,
      tag: 'DTM',
      text: formData.text,
    });
  }
}
