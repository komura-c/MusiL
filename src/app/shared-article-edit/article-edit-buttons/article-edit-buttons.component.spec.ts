import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Article } from '@interfaces/article';
import { ArticleEditButtonsComponent } from './article-edit-buttons.component';

describe('ArticleEditButtonsComponent', () => {
  let component: ArticleEditButtonsComponent;
  let fixture: ComponentFixture<ArticleEditButtonsComponent>;
  const article: Partial<Article> = { articleId: 'xxx' };

  beforeEach(async(() => {
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
