import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
    comment: ['', [Validators.required]],
  });
  processing: boolean;

  constructor(
    private fb: FormBuilder,
    public commentService: CommentService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  get commentControl() {
    return this.form.get('comment') as FormControl;
  }

  ngOnInit(): void {
    this.allComments$ = this.commentService.getLatestArticleComments(
      this.articleId
    );
  }

  sendComment(uid: string) {
    this.processing = true;
    const comment: string = this.commentControl.value;
    this.form.reset();
    if (comment?.replace('\n|\r', '')) {
      this.commentService.sendComment(this.articleId, comment, uid);
    }
    setTimeout(() => {
      this.processing = false;
    }, 5000);
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
