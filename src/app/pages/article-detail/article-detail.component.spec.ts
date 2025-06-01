import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MatLegacyDialog as MatDialog,
  MAT_LEGACY_DIALOG_SCROLL_STRATEGY as MAT_DIALOG_SCROLL_STRATEGY,
} from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { LikeService } from 'src/app/services/like.service';
import { SeoService } from 'src/app/services/seo.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { ViewCountService } from 'src/app/services/view-count.service';
import {
  ArticleServiceStub,
  AuthServiceStub,
  LikeServiceStub,
  ActivatedRouteStub,
  ViewCountServiceStub,
} from 'src/test/service.stub';
import { getCommonProviders } from 'src/test/test-helpers';
import ArticleDetailComponent from './article-detail.component';

describe('ArticleDetailComponent', () => {
  let component: ArticleDetailComponent;
  let fixture: ComponentFixture<ArticleDetailComponent>;
  let activatedRouteStub: ActivatedRouteStub;

  const SeoServiceStub = {
    updateTitleAndMeta: jasmine.createSpy('updateTitleAndMeta'),
    createLinkTagForCanonicalURL: jasmine.createSpy('createLinkTagForCanonicalURL'),
  };

  const ScrollServiceStub = {
    scrollToTop: jasmine.createSpy('scrollToTop'),
  };

  beforeEach(waitForAsync(() => {
    activatedRouteStub = new ActivatedRouteStub();
    // Set up parent route with paramMap
    activatedRouteStub.parent = {
      paramMap: activatedRouteStub.paramMap
    } as any;

    TestBed.configureTestingModule({
      imports: [ArticleDetailComponent],
      providers: [
        ...getCommonProviders(),
        MatSnackBar,
        Overlay,
        MatDialog,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: {} },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: ArticleService, useValue: ArticleServiceStub },
        { provide: LikeService, useValue: LikeServiceStub },
        { provide: SeoService, useValue: SeoServiceStub },
        { provide: ScrollService, useValue: ScrollServiceStub },
        { provide: ViewCountService, useValue: ViewCountServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDetailComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
