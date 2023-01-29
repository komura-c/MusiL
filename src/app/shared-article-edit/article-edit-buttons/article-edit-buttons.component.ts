import { Component, Input } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Article } from '@interfaces/article';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { environment } from 'src/environments/environment';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-article-edit-buttons',
  templateUrl: './article-edit-buttons.component.html',
  styleUrls: ['./article-edit-buttons.component.scss'],
})
export class ArticleEditButtonsComponent {
  @Input() article: Article | ArticleWithAuthor;
  @Input() screenName: string;
  projectURL = environment.hostingURL;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard
  ) {}

  openDeleteDialog(article: Article | ArticleWithAuthor) {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: article,
    });
  }

  copyLink(): void {
    if (this.screenName) {
      this.clipboard.copy(
        this.projectURL + '/' + this.screenName + '/a/' + this.article.articleId
      );
      this.snackBar.open('URLがコピーされました！', '閉じる');
    } else {
      this.snackBar.open('URLのコピーに失敗しました。', '閉じる');
    }
  }
}
