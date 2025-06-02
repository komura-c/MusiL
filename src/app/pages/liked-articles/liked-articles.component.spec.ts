import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';
import { ArticleServiceStub, UserServiceStub, ActivatedRouteStub } from 'src/test/service.stub';
import { getCommonProviders } from 'src/test/test-helpers';
import LikedArticlesComponent from './liked-articles.component';

describe('LikedArticlesComponent', () => {
  let component: LikedArticlesComponent;
  let fixture: ComponentFixture<LikedArticlesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, LikedArticlesComponent],
      providers: [
        ...getCommonProviders(),
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ArticleService, useValue: ArticleServiceStub },
        { provide: UserService, useValue: UserServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedArticlesComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
