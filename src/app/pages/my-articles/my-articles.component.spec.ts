import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';
import { ArticleServiceStub, UserServiceStub } from 'src/test/service.stub';
import MyArticlesComponent from './my-articles.component';

describe('MyArticlesComponent', () => {
  let component: MyArticlesComponent;
  let fixture: ComponentFixture<MyArticlesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MyArticlesComponent],
      providers: [
        { provide: UserService, useValue: UserServiceStub },
        { provide: ArticleService, useValue: ArticleServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
