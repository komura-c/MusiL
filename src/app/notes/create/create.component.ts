import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Article } from 'src/app/interfaces/article';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    tag: [''],
    editorContent: [''],
  });
  editorPreview: string;

  get titleControl() {
    return this.form.get('title') as FormControl;
  }

  get tagControl() {
    return this.form.get('tag') as FormControl;
  }

  get editorContentControl() {
    return this.form.get('editorContent') as FormControl;
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '350px',
    minHeight: '350px',
    maxHeight: '350px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: '作曲やDTMに関する知識を共有しよう',
    defaultParagraphSeparator: 'p',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['subscript',
        'superscript', 'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull', 'indent',
        'outdent', 'fontName'],
      ['fontSize', 'textColor',
        'backgroundColor', 'customClasses',
        'insertImage',
        'insertVideo', 'insertHorizontalRule',
        'toggleEditorMode']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((inputText) => {
      this.editorPreview = inputText.editorContent;
    });
  }

  submit() {
    const formData = this.form.value;
    const sendData: Omit<Article, 'articleId' | 'createdAt' | 'updatedAt'>
      = {
      uid: this.authService.uid,
      imageURL: 'http://placekitten.com/700/300',
      title: formData.title,
      tag: 'DTM',
      text: formData.editorContent,
    };
    this.articleService.createArticle(sendData).then(() => {
      this.router.navigateByUrl('/');
      this.snackBar.open('記事を投稿しました', null, {
        duration: 2000,
      });
    });
  }
}
