import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'functions/src/interfaces/article';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { SeoService } from 'src/app/services/seo.service';
import { UserData } from '@interfaces/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { OgpService } from 'src/app/services/ogp.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  private articleId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => {
      return params.get('id');
    })
  );
  private article$ = this.articleId$.pipe(
    switchMap((id) => {
      return id ? this.articleService.getArticleOnly(id) : of(null);
    })
  );
  private articleId: string;
  private user: UserData;

  readonly titleMaxLength = 60;
  readonly tagMaxWordCount = 50;
  readonly tagMaxLength = 10;

  // NOTE: Guardで使用している
  public isComplete = false;

  inProgress = false;
  tags: string[] = [];
  form = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.maxLength(this.titleMaxLength)],
    ],
    tag: ['', Validators.maxLength(this.tagMaxWordCount)],
    editorContent: [''],
    isPublic: [true],
  });

  get titleControl() {
    return this.form.get('title') as FormControl;
  }

  get isPublicControl() {
    return this.form.get('isPublic') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private seoService: SeoService,
    private db: AngularFirestore,
    private ogpService: OgpService
  ) {
    this.seoService.updateTitleAndMeta({
      title: `記事の編集 | MusiL`,
      description: `記事を投稿・編集するページです`,
    });
  }

  ngOnInit(): void {
    this.getUserData();
    this.getArticleAndPatchValue();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = '作業中の内容が失われますが、よろしいですか？';
    }
  }

  getUserData() {
    this.authService.user$
      .pipe(take(1))
      .toPromise()
      .then((user) => (this.user = user));
  }

  getArticleAndPatchValue() {
    this.article$
      .pipe(take(1))
      .toPromise()
      .then((article: Article) => {
        if (article) {
          this.articleId = article.articleId;
          this.tags = article.tags;
          this.form.patchValue({
            title: article.title,
            editorContent: article.text,
            isPublic: article.isPublic,
          });
        }
      });
  }

  cancel() {
    this.location.back();
  }

  submit() {
    this.inProgress = true;
    const formData = this.form.value;
    const sendData: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    > = {
      uid: this.user.uid,
      thumbnailURL: null,
      title: formData.title,
      tags: this.tags,
      text: formData.editorContent,
      isPublic: formData.isPublic,
    };
    this.isComplete = true;

    const msg = formData.isPublic
      ? '記事を投稿しました！おめでとうございます。'
      : '下書きを保存しました！おつかれさまです。';

    if (this.articleId) {
      this.articleService
        .updateArticle(this.articleId, sendData)
        .then(() => {
          this.succeededSubmit(msg, sendData);
        })
        .catch((error) => {
          this.failedSubmit(error);
        });
    } else {
      this.articleId = this.db.createId();
      this.articleService
        .createArticle(this.articleId, sendData)
        .then(() => {
          this.succeededSubmit(msg, sendData);
        })
        .catch((error) => {
          this.failedSubmit(error);
        });
    }
  }

  succeededSubmit(
    msg: string,
    sendData: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    >
  ) {
    this.router.navigateByUrl(
      '/' + this.user.screenName + '/a/' + this.articleId
    );
    this.snackBar.open(msg, '閉じる');
    this.ogpService.createOgpImageAndUpload(
      sendData.title,
      this.articleId,
      this.user
    );
  }

  failedSubmit(error: { message: any }) {
    console.error(error.message);
    this.snackBar.open(
      'すみません、投稿エラーです。数秒後にもう一度お試しください。',
      '閉じる'
    );
  }
}
