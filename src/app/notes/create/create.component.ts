import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/draggable.min.js';
import 'froala-editor/js/third_party/embedly.min.js';
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
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Article } from 'functions/src/interfaces/article';

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
    isPublic: [true],
  });
  froalaEditor;
  isComplete: boolean;

  articleId: string;

  get titleControl() {
    return this.form.get('title') as FormControl;
  }

  get tagControl() {
    return this.form.get('tag') as FormControl;
  }

  get editorContentControl() {
    return this.form.get('editorContent') as FormControl;
  }

  get isPublicControl() {
    return this.form.get('isPublic') as FormControl;
  }

  public options = {
    toolbarSticky: false,
    toolbarInline: false,
    height: '350',
    placeholderText: '作曲やDTMに関する知識を共有しよう',
    charCounterCount: true,
    attribution: false,
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
        buttons: ['insertLink', 'embedly', 'insertImage', 'insertVideo', 'insertTable', 'emoticons'],
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
        buttons: ['insertLink', 'embedly', 'insertImage', 'insertVideo', 'insertTable', 'emoticons'],
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
          this.ngZone.run(() => {
            const msg = '３メガバイト未満の画像を利用してください';
            this.snackBar.open(msg, '閉じる', { duration: 5000 });
          });
          return false;
        }
      },
      'link.beforeInsert': (link, text) => {
        const httpPattern = /^(https|http):\/\//;
        if (!httpPattern.test(link)) {
          this.ngZone.run(() => {
            const msg = '正しいURLではありません';
            this.snackBar.open(msg, '閉じる', { duration: 5000 });
          });
          return false;
        }
        const soundCloudPattern = /^(https|http):\/\/soundcloud\.com(\/.*|\?.*|$)/;
        if (soundCloudPattern.test(link)) {
          const soundCloudURL = link.match(soundCloudPattern);
          console.log(soundCloudURL);
          const soundCloudEmbedPlayer = '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com' + soundCloudURL[2] + '&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>' + text;
          const currentValue = this.form.value;
          this.form.patchValue({
            title: currentValue.title,
            tag: currentValue.tag,
            editorContent: currentValue.editorContent + soundCloudEmbedPlayer,
            isPublic: currentValue.isPublic,
          });
          this.ngZone.run(() => {
            const msg = 'SoundCloudの埋め込みが完了しました';
            this.snackBar.open(msg, '閉じる', { duration: 5000 });
          });
          return false;
        }
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private ngZone: NgZone,
    private location: Location,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.pipe(
      switchMap(map => {
        const id = map.get('id');
        return id ? this.articleService.getArticleOnly(id) : of(null);
      })
    ).subscribe((article: Article) => {
      this.articleId = article.articleId;
      this.form.patchValue({
        title: article.title,
        tag: article.tag,
        editorContent: article.text,
        isPublic: article.isPublic,
      });
    });
  }

  ngOnInit(): void { }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = '作業中の内容が失われますが、よろしいですか？';
    }
  }

  cancel() {
    this.location.back();
  }

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
      isPublic: formData.isPublic
    };
    this.isComplete = true;
    let msg: string;
    if (formData.isPublic) {
      msg = '記事を投稿しました！おめでとうございます。';
    } else {
      msg = '下書きを保存しました！おつかれさまです。';
    }
    if (this.articleId) {
      this.articleService.updateArticle(this.articleId, sendData).then(() => {
        this.router.navigateByUrl('/');
        this.snackBar.open(msg, '閉じる', { duration: 5000 });
      });
    } else {
      this.articleService.createArticle(sendData).then(() => {
        this.router.navigateByUrl('/');
        this.snackBar.open(msg, '閉じる', { duration: 5000 });
      });
    }
  }
}
