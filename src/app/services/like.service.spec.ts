import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/firestore';
import { environmentStub } from 'src/test/environment.stub';
import { FirestoreStub } from 'src/test/firebase.stub';
import { LikeService } from './like.service';

describe('LikeService', () => {
  let service: LikeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environmentStub.firebase),
        AngularFirestoreModule,
      ],
      providers: [{ provide: AngularFirestore, useValue: FirestoreStub }],
    });
    service = TestBed.inject(LikeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
