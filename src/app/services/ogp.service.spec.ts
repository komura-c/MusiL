import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { environmentStub } from 'src/test/environment.stub';
import { FireStorageStub, FirestoreStub } from 'src/test/firebase.stub';
import { OgpService } from './ogp.service';

describe('OgpService', () => {
  let service: OgpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environmentStub.firebase),
        AngularFirestoreModule,
      ],
      providers: [
        { provide: AngularFirestore, useValue: FirestoreStub },
        { provide: AngularFireStorage, useValue: FireStorageStub },
      ],
    });
    service = TestBed.inject(OgpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
