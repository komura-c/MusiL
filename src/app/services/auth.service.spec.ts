import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { environmentStub } from 'src/test/environment.stub';
import { FirestoreStub } from 'src/test/firebase.stub';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environmentStub.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
      providers: [
        MatSnackBar,
        { provide: AngularFirestore, useValue: FirestoreStub },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
