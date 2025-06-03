import { Component, Input } from '@angular/core';
import {
  MatLegacyDialogModule,
  MatLegacyDialog as MatDialog,
} from '@angular/material/legacy-dialog';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Article } from '@interfaces/article';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { environment } from 'src/environments/environment';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule } from '@angular/material/legacy-menu';
import { RouterLink } from '@angular/router';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { ExportService, ExportFormat } from 'src/app/services/export.service';

@Component({
  selector: 'app-article-edit-buttons',
  templateUrl: './article-edit-buttons.component.html',
  styleUrls: ['./article-edit-buttons.component.scss'],
  standalone: true,
  imports: [
    MatLegacyButtonModule,
    RouterLink,
    MatLegacyMenuModule,
    MatIconModule,
    MatLegacyDialogModule,
  ],
})
export class ArticleEditButtonsComponent {
  @Input() article: Article | ArticleWithAuthor;
  @Input() screenName: string;
  projectURL = environment.hostingURL;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard,
    private exportService: ExportService
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

  exportArticle(format: ExportFormat): void {
    try {
      this.exportService.exportArticle(this.article, format);
      const formatName = this.getFormatDisplayName(format);
      this.snackBar.open(`記事を${formatName}形式でエクスポートしました！`, '閉じる');
    } catch (error) {
      console.error('Export failed:', error);
      this.snackBar.open('エクスポートに失敗しました。', '閉じる');
    }
  }

  private getFormatDisplayName(format: ExportFormat): string {
    switch (format) {
      case 'markdown':
        return 'Markdown';
      case 'html':
        return 'HTML';
      case 'text':
        return 'テキスト';
      default:
        return '';
    }
  }
}
