import { Location, NgIf } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Article } from '@interfaces/article';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { SeoService } from 'src/app/services/seo.service';
import { UserData } from '@interfaces/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { EditorComponent } from 'src/app/components/editor/editor.component';
import { TagFormComponent } from 'src/app/components/tag-form/tag-form.component';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WindowService } from 'src/app/services/window.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatLegacyButtonModule,
    MatIconModule,
    RouterLink,
    ReactiveFormsModule,
    MatLegacySlideToggleModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    NgIf,
    TagFormComponent,
    EditorComponent,
  ],
})
export default class CreateComponent implements OnInit {
  private readonly firebaseService = inject(FirebaseService);

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
    return this.form.get('title') as UntypedFormControl;
  }

  get isPublicControl() {
    return this.form.get('isPublic') as UntypedFormControl;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private articleService: ArticleService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private windowService: WindowService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.updateTitleAndMeta({
      title: `記事の編集 | MusiL`,
      description: `記事を投稿・編集するページです`,
    });
    this.seoService.createLinkTagForCanonicalURL();
    this.firebaseService.logEvent('create_page');
    this.loadUserData();
    this.loadArticleAndPatchValue();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = '作業中の内容が失われますが、よろしいですか？';
    }
  }

  private loadUserData() {
    this.authService.user$
      .pipe(take(1))
      .toPromise()
      .then((user) => (this.user = user));
  }

  private loadArticleAndPatchValue() {
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
    // NOTE: this.location.back();を実行するとguardでconfirm:falseの時に履歴の状態に齟齬が発生するので冗長に記述
    if (this.form.pristine || this.isComplete) {
      this.location.back();
      return;
    }
    const confirmation = this.windowService.confirm(
      '作業中の内容が失われますがよろしいですか？'
    );
    if (confirmation) {
      // guardで反応させないために更新
      this.isComplete = true;
      this.location.back();
      return;
    }
  }

  private createOGPURL(title: string): string {
    const baseFirstURL = 'https://res.cloudinary.com/musil/image/upload/';
    const baseLastURL = '/v1604767919/base_ebd8yk.png';
    const userNameText =
      this.user.userName +
      ',w_960' +
      (this.user.userName.length < 26 ? ',y_80' : ',y_60');
    const contentURL =
      'c_fit,co_rgb:222,g_north,l_text:a8duhpsxchugqa5gfntl.otf_37_bold:' +
      userNameText +
      '/c_fit,co_rgb:222,l_text:a8duhpsxchugqa5gfntl.otf_60_bold:' +
      title +
      ',w_1060,h_400';
    return baseFirstURL + encodeURIComponent(contentURL) + baseLastURL;
  }

  submit() {
    this.inProgress = true;
    const formData = this.form.value;
    const thumbnailURL = this.createOGPURL(formData.title);
    const sendData: Omit<
      Article,
      'articleId' | 'createdAt' | 'updatedAt' | 'likeCount'
    > = {
      uid: this.user.uid,
      thumbnailURL,
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
          this.succeededSubmit(this.articleId, msg);
        })
        .catch((error) => {
          this.failedSubmit(error);
        });
    } else {
      this.articleService
        .createArticle(sendData)
        .then((articleId) => {
          this.succeededSubmit(articleId, msg);
        })
        .catch((error) => {
          this.failedSubmit(error);
        });
    }
  }

  private succeededSubmit(articleId: string, msg: string) {
    this.router.navigateByUrl('/' + this.user.screenName + '/a/' + articleId);
    this.snackBar.open(msg, '閉じる');
  }

  private failedSubmit(error: { message: any }) {
    console.error(error.message);
    this.snackBar.open(
      'すみません、投稿エラーです。数秒後にもう一度お試しください。',
      '閉じる'
    );
  }
}
