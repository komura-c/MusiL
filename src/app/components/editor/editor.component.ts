import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  NgZone,
  OnInit,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ArticleService } from 'src/app/services/article.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import {
  UntypedFormGroup,
  UntypedFormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatLegacyDialogModule,
  MatLegacyDialog as MatDialog,
} from '@angular/material/legacy-dialog';
import { LinkInsertDialogComponent } from '../link-insert-dialog/link-insert-dialog.component';
import { QuillModule } from 'ngx-quill';
import type { QuillModules } from 'ngx-quill';
import type { ImageData as QuillImageData } from 'quill-image-drop-and-paste';
import { NgIf } from '@angular/common';
import { QuillEditorInstance, dynamicImportQuill } from 'src/app/lib/quill';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, QuillModule, MatLegacyDialogModule],
})
export class EditorComponent implements OnInit {
  @Input() parentForm: UntypedFormGroup;
  @ViewChild('imageInput') private imageInput: ElementRef<HTMLElement>;

  editorInstance: QuillEditorInstance;
  quillModules: QuillModules = {
    toolbar: {
      container: [
        [
          { header: [2, 3, 4, false] },
          'bold',
          'italic',
          'underline',
          'strike',
          'blockquote',
          { list: 'ordered' },
          { list: 'bullet' },
          'link',
          'image',
          'video',
        ],
      ],
      handlers: {
        link: this.openLinkInsertDialogHandler.bind(this),
        image: this.inputImageHandler.bind(this),
      },
    },
    clipboard: {
      matchVisual: false,
    },
    imageResize: {},
    imageDropAndPaste: {
      handler: this.dropImageHandler.bind(this),
    },
  };
  quillComponentLoaded = false;

  get editorContentControl() {
    return this.parentForm.get('editorContent') as UntypedFormControl;
  }

  constructor(
    private ngZone: NgZone,
    private authService: AuthService,
    private articleService: ArticleService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    dynamicImportQuill()
      .then(() => {
        this.quillComponentLoaded = true;
      })
      .catch((err) => {
        console.error('dynamicImportQuillError: ', err);
      });
  }

  editorCreated(editorInstance: QuillEditorInstance) {
    const editorInputDefaultLink: HTMLElement =
      editorInstance.theme.tooltip.root.querySelector('input[data-link]');
    editorInputDefaultLink.dataset['link'] = 'https://musil.place/';
    editorInputDefaultLink.dataset['video'] = 'https://www.youtube.com/';

    this.editorInstance = editorInstance;
  }

  openLinkInsertDialogHandler() {
    this.ngZone.run(() => {
      const dialogRef = this.dialog.open(LinkInsertDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: 480,
        width: '90vw',
      });
      dialogRef.afterClosed().subscribe((formData) => {
        if (!formData) {
          return;
        }
        const { linkInput, linkText } = formData;
        this.linkInsert(linkInput, linkText);
      });
    });
  }

  linkInsert(link: string, text?: string) {
    const soundCloudReg = /^(https|http):\/\/soundcloud\.com(\/.*|\?.*|$)/;
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
      const msg = 'SoundCloudの埋め込みが完了しました';
      this.snackBar.open(msg, '閉じる');
      return;
    } else {
      if (!text) {
        text = link;
      }
      const currentValue = this.editorContentControl.value;
      this.editorContentControl.patchValue(
        currentValue +
          '<p>​<a href="' +
          link +
          '" rel="nofollow noopener noreferrer">' +
          text +
          '</a>​​​</p>'
      );
      return;
    }
  }

  inputImageHandler() {
    this.imageInput.nativeElement.click();
  }

  onInsertImageEvent({ target }: { target: EventTarget }) {
    const file = (target as HTMLInputElement).files[0];
    this.uploadImage(file);
  }

  dropImageHandler(_dataUrl: string, _type: string, imageData: QuillImageData) {
    imageData
      .minify({
        maxWidth: 800,
        quality: 0.7,
      })
      .then((miniImageData) => {
        if (miniImageData && 'toFile' in miniImageData) {
          const file = miniImageData.toFile();
          this.uploadImage(file);
        }
        return;
      });
  }

  uploadImage(imageFile: File) {
    const fileSizeLimit = 3000000;
    if (imageFile.size < fileSizeLimit) {
      const downloadURLPromise = this.articleService.uploadImage(
        this.authService.uid,
        imageFile
      );
      downloadURLPromise.then((downloadURL) => {
        const selection = this.editorInstance.getSelection();
        this.editorInstance.insertEmbed(selection.index, 'image', downloadURL);
      });
      return;
    } else {
      const msg = '３メガバイト未満の画像を利用してください';
      this.snackBar.open(msg, '閉じる');
      return;
    }
  }
}
