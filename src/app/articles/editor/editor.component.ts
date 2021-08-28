import { Component, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ArticleService } from 'src/app/services/article.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LinkInsertDialogComponent } from '../link-insert-dialog/link-insert-dialog.component';
import { QuillModules } from 'ngx-quill';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  @Input() parentForm: FormGroup;

  editorInstance: any;

  @ViewChild('imageInput') private imageInput: ElementRef<HTMLElement>;
  quillModules: QuillModules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }, 'bold', 'italic', 'underline', 'strike', 'blockquote', { list: 'ordered' }, { list: 'bullet' }, 'link', 'image', 'video'],
      ],
      handlers: {
        link: (() => {
          this.openLinkInsertDialog();
        }).bind(this),
        image: (() => {
          this.imageInput.nativeElement.click();
        }).bind(this),
      },
    },
    clipboard: {
      matchVisual: false,
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
    this.editorInstance = editorInstance;
    const editorInputDefaultLink: HTMLElement = editorInstance.theme.tooltip.root.querySelector("input[data-link]");
    editorInputDefaultLink.dataset.link = 'https://musil.place/';
    editorInputDefaultLink.dataset.video = 'https://www.youtube.com/';
  }

  openLinkInsertDialog() {
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
        this.linkInsertEvent(linkInput, linkText);
      });
    });
  }

  linkInsertEvent(link: string, text?: string) {
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

  uploadAndImageInsertEvent({ target }: { target: HTMLInputElement }) {
    const file = target.files[0];
    const fileSizeLimit = 3000000;
    if (file.size < fileSizeLimit) {
      const downloadURLPromise = this.articleService.uploadImage(
        this.authService.uid,
        file
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
