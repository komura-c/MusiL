import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Article } from 'src/app/interfaces/article';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/draggable.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/fullscreen.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/image_manager.min.js';
import 'froala-editor/js/plugins/inline_style.min.js';
import 'froala-editor/js/plugins/line_breaker.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/paragraph_style.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/quick_insert.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/plugins/word_paste.min.js';
import 'froala-editor/js/languages/ja.js';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    tag: [''],
    editorContent: [''],
  });
  froalaEditor;

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
    height: '350',
    placeholderText: '作曲やDTMに関する知識を共有しよう',
    charCounterCount: true,
    language: 'ja',
    toolbarButtonsSM: {
      moreText: {
        buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'textColor', 'clearFormatting'],
        buttonsVisible: 3
      },
      moreParagraph: {
        buttons: ['formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'quote'],
        buttonsVisible: 3
      },
      moreRich: {
        buttons: ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons'],
        buttonsVisible: 3
      },
      moreMisc: {
        buttons: ['undo', 'redo', 'fullscreen'],
        align: 'right',
        buttonsVisible: 3
      }
    },
    toolbarButtonsXS: {
      moreText: {
        buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'textColor', 'clearFormatting'],
        buttonsVisible: 0
      },
      moreParagraph: {
        buttons: ['formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'quote'],
        buttonsVisible: 0
      },
      moreRich: {
        buttons: ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons'],
        buttonsVisible: 0
      },
      moreMisc: {
        buttons: ['undo', 'redo', 'fullscreen'],
        align: 'right',
        buttonsVisible: 3
      }
    },
    pastePlain: true,
    imageAddNewLine: true,
    videoInsertButtons: ['videoBack', '|', 'videoByURL', 'videoEmbed'],
    events: {
      initialized: (editor) => {
        this.froalaEditor = editor;
      },
      'image.beforeUpload': (images) => {
        const file = images[0];
        const fileSizeLimit = 3000000;
        const uid = this.authService.uid;
        if ((file.size < fileSizeLimit)) {
          const downloadURLPromise = this.articleService.uploadImage(uid, file);
          downloadURLPromise.then((downloadURL) => {
            this.froalaEditor._editor.image.insert(downloadURL, null, null, this.froalaEditor._editor.image.get());
          });
          return null;
        } else {
          const msg = '３メガバイト未満の画像を利用してください';
          this.ngZone.run(() => {
            this.snackBar.open(msg, '閉じる');
          });
          return false;
        }
      },
    }
  };

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void { }

  getFirstImageURL(html: string): string {
    const imgTagPattern = /<img(?: .+?)?>.*?/i;
    if (imgTagPattern.test(html)) {
      const firstImgTag = html.match(imgTagPattern);
      const srcPattern = /src=["|'](.*?)["|']+/i;
      return firstImgTag[0].match(srcPattern)[1].replace(/&amp;/, '&');
    } else {
      return 'null';
    }
  }

  submit() {
    const formData = this.form.value;
    const html = formData.editorContent;
    const firstImageURL = this.getFirstImageURL(html);
    const sendData: Omit<Article, 'articleId' | 'createdAt' | 'updatedAt'>
      = {
      uid: this.authService.uid,
      thumbnailURL: firstImageURL,
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
