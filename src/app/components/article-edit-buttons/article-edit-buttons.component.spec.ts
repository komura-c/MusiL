import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import {
  MatLegacySnackBar as MatSnackBar,
  MatLegacySnackBarModule as MatSnackBarModule,
} from '@angular/material/legacy-snack-bar';
import { Article } from '@interfaces/article';
import { ArticleEditButtonsComponent } from './article-edit-buttons.component';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { ArticleServiceStub, ActivatedRouteStub } from 'src/test/service.stub';
import { ActivatedRoute } from '@angular/router';

describe('ArticleEditButtonsComponent', () => {
  let component: ArticleEditButtonsComponent;
  let fixture: ComponentFixture<ArticleEditButtonsComponent>;
  const article: Partial<Article> = { articleId: 'xxx' };

  beforeEach(waitForAsync(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      imports: [MatMenuModule, ArticleEditButtonsComponent],
      providers: [
        MatSnackBar,
        { provide: ArticleService, useValue: ArticleServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleEditButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
