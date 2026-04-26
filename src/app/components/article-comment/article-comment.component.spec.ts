import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog';
import {
  MatSnackBar as MatSnackBar,
  MatSnackBarModule as MatSnackBarModule,
} from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import {
  AuthServiceStub,
  CommentServiceStub,
  ActivatedRouteStub,
} from 'src/test/service.stub';
import { ArticleCommentComponent } from './article-comment.component';
import { getCommonProviders } from 'src/test/test-helpers';

describe('ArticleCommentComponent', () => {
  let component: ArticleCommentComponent;
  let fixture: ComponentFixture<ArticleCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        ArticleCommentComponent,
      ],
      providers: [
        ...getCommonProviders(),
        MatSnackBar,
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: CommentService, useValue: CommentServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCommentComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
