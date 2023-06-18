import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ArticleCommentWithAuthor } from '@interfaces/article-comment-with-author';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-article-comment',
    templateUrl: './article-comment.component.html',
    styleUrls: ['./article-comment.component.scss'],
    standalone: true,
    imports: [
        MatIconModule,
        NgIf,
        NgFor,
        RouterLink,
        MatLegacyButtonModule,
        MatDividerModule,
        ReactiveFormsModule,
        MatLegacyFormFieldModule,
        MatLegacyInputModule,
        TextFieldModule,
        MatLegacyProgressSpinnerModule,
        AsyncPipe,
    ],
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
    private fb: UntypedFormBuilder,
    public commentService: CommentService,
    public authService: AuthService
  ) {}

  private removeSpaces(control: AbstractControl): null | undefined {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
      return;
    }
    return null;
  }

  get commentControl() {
    return this.form.get('comment') as UntypedFormControl;
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
      if (comment) {
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
