import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ArticleCommentWithAuthor } from '@interfaces/article-comment-with-author';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { LoginDialogComponent } from 'src/app/shared-login-dialog/login-dialog/login-dialog.component';

@Component({
  selector: 'app-article-comment',
  templateUrl: './article-comment.component.html',
  styleUrls: ['./article-comment.component.scss'],
})
export class ArticleCommentComponent implements OnInit {
  @Input() articleId: string;
  allComments$: Observable<ArticleCommentWithAuthor[]>;
  form = this.fb.group({
    comment: [''],
  });
  processing: boolean;

  constructor(
    private fb: FormBuilder,
    public commentService: CommentService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.allComments$ = this.commentService.getLatestArticleComments(
      this.articleId
    );
  }

  sendComment(uid: string) {
    const comment = this.form.value.comment;
    this.processing = true;

    this.commentService.sendComment(this.articleId, comment, uid);
    this.form.reset();
    this.processing = false;
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
