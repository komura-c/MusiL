import { Component, Inject } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import {
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
  MatDialogRef as MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';
import { Article } from '@interfaces/article';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss'],
    imports: [MatDialogModule, MatButtonModule]
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
