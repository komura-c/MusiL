import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Article } from 'src/app/interfaces/article';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/code_beautifier.min.js';
import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins/draggable.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/file.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/fullscreen.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/image_manager.min.js';
import 'froala-editor/js/third_party/image_tui.min.js';
import 'froala-editor/js/plugins/line_breaker.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/help.min.js';
import 'froala-editor/js/plugins/paragraph_style.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/quick_insert.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/languages/ja.js';

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
  editorPreview = '';

  get titleControl() {
    return this.form.get('title') as FormControl;
  }

  get tagControl() {
    return this.form.get('tag') as FormControl;
  }

  get editorContentControl() {
    return this.form.get('editorContent') as FormControl;
  }

  public options = {
    toolbarSticky: false,
    toolbarInline: false,
    height: 350,
    placeholderText: '作曲やDTMに関する知識を共有しよう',
    charCounterCount: true,
    language: 'ja',
    toolbarButtons: [['bold', 'italic', 'underline', 'strikeThrough', 'textColor', 'clearFormatting'], ['formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'quote'], ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'specialCharacters', 'embedly', 'insertFile'], ['undo', 'redo', 'fullscreen', 'help']]
    ,
    toolbarButtonsXS: {
      moreText: {
        buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'textColor', 'clearFormatting']
      },
      moreParagraph: {
        buttons: ['formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'quote']
      },
      moreRich: {
        buttons: ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'specialCharacters', 'embedly', 'insertFile']
      },
      moreMisc: {
        buttons: ['undo', 'redo', 'fullscreen', 'help']
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void { }

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
