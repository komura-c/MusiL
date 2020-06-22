import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
    height: '400px',
    minHeight: '400px',
    maxHeight: '400px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: '作曲やDTMに関する知識を共有しよう',
    defaultParagraphSeparator: 'p',
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['subscript',
        'superscript', 'indent',
        'outdent', 'fontName'],
      ['fontSize', 'textColor',
        'backgroundColor', 'customClasses', 'insertHorizontalRule',
        'toggleEditorMode']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((inputText) => {
      this.editorPreview = inputText.editorContent;
    });
  }

  submit() {
    const formData = this.form.value;
    this.articleService.createArticle({
      userId: this.authService.uid,
      id: 'n00001',
      thumbnailUrl: 'http://placekitten.com/700/300',
      title: formData.title,
      tag: 'DTM',
      text: formData.editorContent,
    });
  }
}
