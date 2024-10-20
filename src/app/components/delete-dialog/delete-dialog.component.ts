import { Component, Inject } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
  MatLegacyDialogModule,
} from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Article } from '@interfaces/article';
import { Router } from '@angular/router';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
  standalone: true,
  imports: [MatLegacyDialogModule, MatLegacyButtonModule],
})
export class DeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Article,
    private articleService: ArticleService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    private router: Router
  ) {}

  deleteArticle() {
    this.dialogRef.close();
    this.articleService.deleteArticle(this.data.articleId).then(() => {
      this.router.navigateByUrl('/');
      this.snackBar.open('削除しました。', '閉じる');
    });
  }
}
