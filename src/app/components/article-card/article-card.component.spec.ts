import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth.service';
import { LikeService } from 'src/app/services/like.service';
import {
  AuthServiceStub,
  LikeServiceStub,
  ActivatedRouteStub,
} from 'src/test/service.stub';
import { ArticleCardComponent } from './article-card.component';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore/lite';

describe('ArticleCardComponent', () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ArticleCardComponent],
      providers: [
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: LikeService, useValue: LikeServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;

    // article プロパティを設定
    component.article = {
      articleId: 'test-id',
      title: 'Test Article',
      createdAt: new Timestamp(0, 0),
      updatedAt: new Timestamp(0, 0),
      likeCount: 0,
      thumbnailURL: 'test-thumbnail-url',
      tags: ['test-tag'],
      text: 'Test text',
      isPublic: true,
      uid: 'test-uid',
      author: {
        uid: 'test-uid',
        screenName: 'Test User',
        userName: 'Test User',
        avatarURL: 'test-avatar-url',
        description: 'Test description',
      },
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
