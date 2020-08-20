import { Component, OnInit, NgZone, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ArticleService } from 'src/app/services/article.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl } from '@angular/forms';
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

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @Input() parentForm: FormGroup;
  private toolbar = {
    moreText: {
      buttons: [
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'textColor',
        'clearFormatting',
      ],
      buttonsVisible: 3,
    },
    moreParagraph: {
      buttons: [
        'formatOL',
        'formatUL',
        'paragraphFormat',
        'paragraphStyle',
        'quote',
      ],
      buttonsVisible: 3,
    },
    moreRich: {
      buttons: [
        'insertLink',
        'insertImage',
        'insertVideo',
        'embedly',
        'insertTable',
        'emoticons',
      ],
      buttonsVisible: 3,
    },
    moreMisc: {
      buttons: ['undo', 'redo', 'fullscreen'],
      align: 'right',
      buttonsVisible: 3,
    },
  };

  froalaEditor: { _editor: { image: { insert: (arg0: void, arg1: any, arg2: any, arg3: any) => void; get: () => any; }; }; };
  options = {
    toolbarSticky: false,
    toolbarInline: false,
    heightMin: '260',
    heightMax: '260',
    placeholderText: '作曲やDTMに関する知識を共有しよう',
    charCounterCount: true,
    attribution: false,
    language: 'ja',
    embedlyScriptPath: '',
    pastePlain: true,
    imageAddNewLine: true,
    quickInsertTags: [],
    videoInsertButtons: ['videoBack', '|', 'videoByURL', 'videoEmbed'],
    toolbarButtonsSM: this.toolbar,
    toolbarButtonsXS: {
      moreText: {
        buttons: this.toolbar.moreText.buttons,
        buttonsVisible: 0,
      },
      moreParagraph: {
        buttons: this.toolbar.moreParagraph.buttons,
        buttonsVisible: 0,
      },
      moreRich: {
        buttons: this.toolbar.moreRich.buttons,
        buttonsVisible: 0,
      },
      moreMisc: this.toolbar.moreMisc,
    },
    events: {
      initialized: (editor: any) => {
        this.froalaEditor = editor;
      },
      'image.beforeUpload': (images: any[]) => {
        const file = images[0];
        const fileSizeLimit = 3000000;
        if (file.size < fileSizeLimit) {
          const downloadURLPromise = this.articleService.uploadImage(this.authService.uid, file);
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
          return false;
        }
      },
      'link.beforeInsert': (link: string, text: string) => {
        const httpReg = new RegExp(/^(https|http):\/\//);
        if (!httpReg.test(link)) {
          this.ngZone.run(() => {
            const msg = '正しいURLではありません';
            this.snackBar.open(msg, '閉じる');
          });
          return false;
        }
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
          const currentValue = this.parentForm.value;
          this.parentForm.patchValue({
            title: currentValue.title,
            tags: currentValue.tags,
            editorContent: currentValue.editorContent + soundCloudEmbedPlayer,
            isPublic: currentValue.isPublic,
          });
          this.ngZone.run(() => {
            const msg = 'SoundCloudの埋め込みが完了しました';
            this.snackBar.open(msg, '閉じる');
          });
          return false;
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
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }
}
