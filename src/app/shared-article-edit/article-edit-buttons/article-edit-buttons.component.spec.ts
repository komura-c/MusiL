import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import {
  MatLegacySnackBar as MatSnackBar,
  MatLegacySnackBarModule as MatSnackBarModule,
} from '@angular/material/legacy-snack-bar';
import { Article } from '@interfaces/article';
import { ArticleEditButtonsComponent } from './article-edit-buttons.component';

describe('ArticleEditButtonsComponent', () => {
  let component: ArticleEditButtonsComponent;
  let fixture: ComponentFixture<ArticleEditButtonsComponent>;
  const article: Partial<Article> = { articleId: 'xxx' };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleEditButtonsComponent],
      imports: [MatDialogModule, MatSnackBarModule, MatMenuModule],
      providers: [MatSnackBar],
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
