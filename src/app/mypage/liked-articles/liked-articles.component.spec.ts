import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';
import { ArticleServiceStub, UserServiceStub } from 'src/test/service.stub';
import { LikedArticlesComponent } from './liked-articles.component';

describe('LikedArticlesComponent', () => {
  let component: LikedArticlesComponent;
  let fixture: ComponentFixture<LikedArticlesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule, LikedArticlesComponent],
    providers: [
        ActivatedRoute,
        { provide: ArticleService, useValue: ArticleServiceStub },
        { provide: UserService, useValue: UserServiceStub },
    ],
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
