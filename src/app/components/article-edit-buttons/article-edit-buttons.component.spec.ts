import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import {
  MatLegacySnackBar as MatSnackBar,
} from '@angular/material/legacy-snack-bar';
import { Article } from '@interfaces/article';
import { ArticleEditButtonsComponent } from './article-edit-buttons.component';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { ArticleServiceStub, ActivatedRouteStub } from 'src/test/service.stub';
import { ActivatedRoute } from '@angular/router';
import { ExportService } from 'src/app/services/export.service';

describe('ArticleEditButtonsComponent', () => {
  let component: ArticleEditButtonsComponent;
  let fixture: ComponentFixture<ArticleEditButtonsComponent>;
  const article: Partial<Article> = { articleId: 'xxx' };

  beforeEach(waitForAsync(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const exportSpy = jasmine.createSpyObj('ExportService', ['exportArticle']);
    TestBed.configureTestingModule({
      imports: [MatMenuModule, ArticleEditButtonsComponent],
      providers: [
        MatSnackBar,
        { provide: ArticleService, useValue: ArticleServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ExportService, useValue: exportSpy },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleEditButtonsComponent);
    component = fixture.componentInstance;

    // Set required input properties
    component.article = article as Article;
    component.screenName = 'test-user';

    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
