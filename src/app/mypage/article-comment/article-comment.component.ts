import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ArticleCommentWithAuthor } from '@interfaces/article-comment-with-author';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-article-comment',
  templateUrl: './article-comment.component.html',
  styleUrls: ['./article-comment.component.scss'],
})
export class ArticleCommentComponent implements OnInit {
  @Input() articleId$: Observable<string>;
  private articleId: string;
  allComments$: Observable<ArticleCommentWithAuthor[]>;
  form = this.fb.group({
    comment: ['', [this.removeSpaces]],
  });
  processing: boolean;

  constructor(
    private fb: FormBuilder,
    public commentService: CommentService,
    public authService: AuthService
  ) {}

  private removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
  }

  get commentControl() {
    return this.form.get('comment') as FormControl;
  }

  ngOnInit(): void {
    this.allComments$ = this.articleId$.pipe(
      switchMap((articleId: string) => {
        this.articleId = articleId;
        return this.commentService.getLatestArticleComments(articleId);
      })
    );
  }

  sendComment(uid: string) {
    if (!this.processing) {
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
  }

  login() {
    this.authService.loginProcessing = true;
    this.authService.login().finally(() => {
      this.authService.loginProcessing = false;
    });
  }
}
