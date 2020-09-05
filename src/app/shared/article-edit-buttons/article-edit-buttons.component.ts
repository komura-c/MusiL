import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Article } from '@interfaces/article';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-article-edit-buttons',
  templateUrl: './article-edit-buttons.component.html',
  styleUrls: ['./article-edit-buttons.component.scss'],
})
export class ArticleEditButtonsComponent implements OnInit {
  @Input() article: Article | ArticleWithAuthor;
  @Input() screenName: string;
  projectURL = environment.hostingURL;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard
  ) { }

  ngOnInit(): void { }

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
