import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { OgpService } from 'src/app/services/ogp.service';
import { FireAnalyticsStub, FirestoreStub } from 'src/test/firebase.stub';
import {
  ArticleServiceStub,
  AuthServiceStub,
  OgpServiceStub,
} from 'src/test/service.stub';
import { CreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CreateComponent],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          RouterTestingModule,
          MatFormFieldModule,
          MatInputModule,
        ],
        providers: [
          FormBuilder,
          MatSnackBar,
          Overlay,
          { provide: AngularFirestore, useValue: FirestoreStub },
          { provide: AngularFireAnalytics, useValue: FireAnalyticsStub },
          { provide: AuthService, useValue: AuthServiceStub },
          { provide: ArticleService, useValue: ArticleServiceStub },
          { provide: OgpService, useValue: OgpServiceStub },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
