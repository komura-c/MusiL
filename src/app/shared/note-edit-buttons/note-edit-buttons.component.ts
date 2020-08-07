import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { ArticleWithAuthor } from '@interfaces/article-with-author';
import { Article } from '@interfaces/article';

@Component({
  selector: 'app-note-edit-buttons',
  templateUrl: './note-edit-buttons.component.html',
  styleUrls: ['./note-edit-buttons.component.scss'],
})
export class NoteEditButtonsComponent implements OnInit {
  @Input() article: Article | ArticleWithAuthor;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openDeleteDialog(article: Article | ArticleWithAuthor) {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: article,
    });
  }
}
