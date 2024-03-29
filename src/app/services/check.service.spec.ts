import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { environmentStub } from 'src/test/environment.stub';
import { FirestoreStub } from 'src/test/firebase.stub';
import { CheckService } from './check.service';

describe('CheckService', () => {
  let service: CheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environmentStub.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
      ],
      providers: [{ provide: AngularFirestore, useValue: FirestoreStub }],
    });
    service = TestBed.inject(CheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
