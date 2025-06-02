import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import {
  MatLegacySnackBar as MatSnackBar,
} from '@angular/material/legacy-snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
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
  let exportSpy: jasmine.SpyObj<ExportService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  const article: Article = { 
    articleId: 'xxx',
    uid: 'test-uid',
    thumbnailURL: 'test-thumbnail.jpg',
    title: 'Test Article',
    tags: ['test'],
    text: '<p>Test content</p>',
    isPublic: true,
    likeCount: 0,
    createdAt: { toDate: () => new Date() } as any,
    updatedAt: { toDate: () => new Date() } as any
  };

  beforeEach(waitForAsync(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    exportSpy = jasmine.createSpyObj('ExportService', ['exportArticle']);
    const clipboardSpy = jasmine.createSpyObj('Clipboard', ['copy']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      imports: [MatMenuModule, ArticleEditButtonsComponent],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ArticleService, useValue: ArticleServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ExportService, useValue: exportSpy },
        { provide: Clipboard, useValue: clipboardSpy },
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

  it('should export article and show success snackbar for markdown format', () => {
    component.article = article as Article;
    component.exportArticle('markdown');
    expect(exportSpy.exportArticle).toHaveBeenCalledWith(article, 'markdown');
    expect(snackBarSpy.open).toHaveBeenCalledWith('記事をMarkdown形式でエクスポートしました！', '閉じる');
  });

  it('should export article and show success snackbar for HTML format', () => {
    component.article = article as Article;
    component.exportArticle('html');
    expect(exportSpy.exportArticle).toHaveBeenCalledWith(article, 'html');
    expect(snackBarSpy.open).toHaveBeenCalledWith('記事をHTML形式でエクスポートしました！', '閉じる');
  });

  it('should export article and show success snackbar for text format', () => {
    component.article = article as Article;
    component.exportArticle('text');
    expect(exportSpy.exportArticle).toHaveBeenCalledWith(article, 'text');
    expect(snackBarSpy.open).toHaveBeenCalledWith('記事をテキスト形式でエクスポートしました！', '閉じる');
  });

  it('should handle export errors and show error snackbar', () => {
    component.article = article as Article;
    exportSpy.exportArticle.and.throwError('Export failed');
    component.exportArticle('markdown');
    expect(exportSpy.exportArticle).toHaveBeenCalledWith(article, 'markdown');
    expect(snackBarSpy.open).toHaveBeenCalledWith('エクスポートに失敗しました。', '閉じる');
  });
});
