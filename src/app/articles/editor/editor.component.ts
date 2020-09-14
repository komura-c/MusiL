import { Component, OnInit, NgZone, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ArticleService } from 'src/app/services/article.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import FroalaEditor from 'froala-editor';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/draggable.min.js';
import 'froala-editor/js/third_party/embedly.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/fullscreen.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/image_manager.min.js';
import 'froala-editor/js/plugins/line_breaker.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/plugins/word_paste.min.js';
import 'froala-editor/js/languages/ja.js';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @Input() parentForm: FormGroup;
  private toolbar = [
    'paragraphFormat',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'quote',
    'insertLink',
    'insertImage',
    'insertVideo',
    'embedly',
    'emoticons',
    'undo',
    'redo',
    'fullscreen',
  ];

  froalaEditor: {
    _editor: {
      image: {
        insert: (arg0: void, arg1: any, arg2: any, arg3: any) => void;
        get: () => any;
      };
    };
  };
  options = {
    key: environment.key,
    toolbarSticky: false,
    toolbarInline: false,
    heightMin: '260',
    heightMax: '260',
    placeholderText:
      '音楽に関する知識を記録してみましょう！例：今日は〇〇の曲を自分なりに分析してみました',
    charCounterCount: true,
    attribution: false,
    language: 'ja',
    embedlyScriptPath: '',
    pastePlain: true,
    imageAddNewLine: true,
    quickInsertTags: [],
    paragraphFormat: {
      H2: '大見出し',
      H3: '中見出し',
      H4: '小見出し',
      N: '本文',
    },
    linkInsertButtons: ['linkBack'],
    linkEditButtons: ['linkEdit', 'linkRemove'],
    imageEditButtons: [
      'imageSize',
      'imageAlign',
      'imageCaption',
      'imageLink',
      'linkRemove',
      'imageRemove',
    ],
    imageInsertButtons: ['imageBack', '|', 'imageUpload'],
    videoEditButtons: ['videoSize', 'videoAlign', 'videoRemove'],
    videoInsertButtons: ['videoBack', '|', 'videoByURL'],
    toolbarButtons: this.toolbar,
    events: {
      initialized: (editor: any) => {
        this.froalaEditor = editor;
        this.parentForm.patchValue({
          editorContent: ' ',
        });
      },
      'image.beforeUpload': (images: any[]) => {
        const file = images[0];
        const fileSizeLimit = 3000000;
        if (file.size < fileSizeLimit) {
          const downloadURLPromise = this.articleService.uploadImage(
            this.authService.uid,
            file
          );
          downloadURLPromise.then((downloadURL) => {
            this.froalaEditor._editor.image.insert(
              downloadURL,
              null,
              null,
              this.froalaEditor._editor.image.get()
            );
          });
          return null;
        } else {
          this.ngZone.run(() => {
            const msg = '３メガバイト未満の画像を利用してください';
            this.snackBar.open(msg, '閉じる');
          });
          return null;
        }
      },
      'link.beforeInsert': (link: string, text: string) => {
        const soundCloudReg = new RegExp(
          /^(https|http):\/\/soundcloud\.com(\/.*|\?.*|$)/
        );
        if (soundCloudReg.test(link)) {
          const soundCloudURL = link.match(soundCloudReg);
          const soundCloudEmbedPlayer =
            '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com' +
            soundCloudURL[2] +
            '&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>' +
            text;
          const currentValue = this.editorContentControl.value;
          this.editorContentControl.patchValue(
            currentValue + soundCloudEmbedPlayer
          );
          this.ngZone.run(() => {
            const msg = 'SoundCloudの埋め込みが完了しました';
            this.snackBar.open(msg, '閉じる');
          });
          return null;
        }
      },
    },
  };

  get editorContentControl() {
    return this.parentForm.get('editorContent') as FormControl;
  }

  constructor(
    private ngZone: NgZone,
    private authService: AuthService,
    private articleService: ArticleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    FroalaEditor.DefineIcon('paragraphFormat', {
      NAME: '見出し',
      template: 'text',
    });
  }
}
