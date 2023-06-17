import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MatLegacyDialog as MatDialog,
  MAT_LEGACY_DIALOG_SCROLL_STRATEGY as MAT_DIALOG_SCROLL_STRATEGY,
} from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { LikeService } from 'src/app/services/like.service';
import {
  ArticleServiceStub,
  AuthServiceStub,
  LikeServiceStub,
} from 'src/test/service.stub';
import { ArticleDetailComponent } from './article-detail.component';

describe('ArticleDetailComponent', () => {
  let component: ArticleDetailComponent;
  let fixture: ComponentFixture<ArticleDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleDetailComponent],
      imports: [RouterTestingModule],
      providers: [
        MatSnackBar,
        Overlay,
        MatDialog,
        MAT_DIALOG_SCROLL_STRATEGY,
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: ArticleService, useValue: ArticleServiceStub },
        { provide: LikeService, useValue: LikeServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
