import { Component, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ArticleService } from 'src/app/services/article.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LinkInsertDialogComponent } from '../link-insert-dialog/link-insert-dialog.component';
import { QuillModules } from 'ngx-quill';
import Quill from 'quill'
import ImageResize from 'quill-image-resize'
import QuillImageDropAndPaste, { ImageData as QuillImageData } from 'quill-image-drop-and-paste';
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  @Input() parentForm: FormGroup;

  @ViewChild('imageInput') private imageInput: ElementRef<HTMLElement>;
  editorInstance: any;
  quillModules: QuillModules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }, 'bold', 'italic', 'underline', 'strike', 'blockquote', { list: 'ordered' }, { list: 'bullet' }, 'link', 'image', 'video'],
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
      handler: this.dropImageHandler.bind(this)
    }
  };

  get editorContentControl() {
    return this.parentForm.get('editorContent') as FormControl;
  }

  constructor(
    private ngZone: NgZone,
    private authService: AuthService,
    private articleService: ArticleService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  editorCreated(editorInstance: any) {
    const editorInputDefaultLink: HTMLElement = editorInstance.theme.tooltip.root.querySelector("input[data-link]");
    editorInputDefaultLink.dataset.link = 'https://musil.place/';
    editorInputDefaultLink.dataset.video = 'https://www.youtube.com/';

    this.editorInstance = editorInstance;
  }

  openLinkInsertDialogHandler() {
    this.ngZone.run(() => {
      const dialogRef = this.dialog.open(LinkInsertDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: 480,
        width: '90vw'
      });
      dialogRef.afterClosed().subscribe(formData => {
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
        '<p>​<a href="' + link + '" rel="nofollow noopener noreferrer">' + text + '</a>​​​</p>'
      );
      return;
    }
  }

  inputImageHandler() {
    this.imageInput.nativeElement.click();
  }

  onInsertImageEvent({ target }: { target: HTMLInputElement }) {
    const file = target.files[0];
    this.uploadImage(file);
  }

  dropImageHandler(_dataUrl: string, _type: string, imageData: QuillImageData) {
    imageData
      .minify({
        maxWidth: 800,
        quality: 0.7,
      })
      .then((miniImageData) => {
        if (miniImageData instanceof QuillImageData) {
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
