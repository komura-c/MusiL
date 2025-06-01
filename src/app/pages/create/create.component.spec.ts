import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { SeoService } from 'src/app/services/seo.service';
import { SearchService } from 'src/app/services/search.service';
import {
  ArticleServiceStub,
  AuthServiceStub,
  SearchServiceStub,
} from 'src/test/service.stub';
import { getCommonProviders } from 'src/test/test-helpers';
import * as analytics from '@angular/fire/analytics';
import CreateComponent from './create.component';

describe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;

  const SeoServiceStub = {
    updateTitleAndMeta: jasmine.createSpy('updateTitleAndMeta'),
    createLinkTagForCanonicalURL: jasmine.createSpy('createLinkTagForCanonicalURL'),
  };

  beforeEach(waitForAsync(() => {
    // Mock logEvent function before component creation
    Object.defineProperty(analytics, 'logEvent', {
      value: jasmine.createSpy('logEvent'),
      writable: true,
      configurable: true
    });
    
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        CreateComponent,
      ],
      providers: [
        ...getCommonProviders(),
        UntypedFormBuilder,
        MatSnackBar,
        Overlay,
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: ArticleService, useValue: ArticleServiceStub },
        { provide: SeoService, useValue: SeoServiceStub },
        { provide: SearchService, useValue: SearchServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
