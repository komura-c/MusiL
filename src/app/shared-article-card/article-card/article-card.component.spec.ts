import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth.service';
import { LikeService } from 'src/app/services/like.service';
import { AuthServiceStub, LikeServiceStub } from 'src/test/service.stub';
import { ArticleCardComponent } from './article-card.component';

describe('ArticleCardComponent', () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ArticleCardComponent],
        providers: [
          { provide: AuthService, useValue: AuthServiceStub },
          { provide: LikeService, useValue: LikeServiceStub },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
