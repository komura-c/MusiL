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

  // NOTE: Guardで使用している
  public isComplete = false;
  tags: string[] = [];
  form = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.maxLength(this.titleMaxLength)],
    ],
    tag: [''],
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
    private seoService: SeoService
  ) {
    const metaTags = {
      title: `記事の編集 | MusiL`,
      description: `記事を投稿・編集するページです`,
      ogType: null,
      ogImage: null,
      twitterCard: null,
    };
    this.seoService.setTitleAndMeta(metaTags);
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
    const formData = this.form.value;
    const sendData: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    > = {
      uid: this.authService.uid,
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

    let task: Promise<void>;
    if (this.articleId) {
      task = this.articleService.updateArticle(
        this.articleId,
        sendData,
        this.user
      );
    } else {
      task = this.articleService.createArticle(sendData, this.user);
    }

    task
      .then(() => {
        this.router.navigateByUrl(
          '/' + this.authService.uid + '/n/' + this.articleService.snapArticleId
        );
        this.snackBar.open(msg, '閉じる');
      })
      .catch((error) => {
        console.error(error.message);
        this.snackBar.open(
          'すみません、投稿エラーです。数秒後にもう一度お試しください。',
          '閉じる'
        );
      });
  }

  ngOnInit(): void {}
}
