import { Component, Inject } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Article } from 'functions/src/interfaces/article';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Article,
    private articleService: ArticleService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    private router: Router
  ) { }

  deleteArticle() {
    this.dialogRef.close();
    this.articleService.deleteArticle(this.data.articleId).then(() => {
      this.router.navigateByUrl('/');
      this.snackBar.open('削除しました。', '閉じる');
    });
  }
}
