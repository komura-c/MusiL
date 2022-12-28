import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { environmentStub } from 'src/test/environment.stub';
import { FirestoreStub } from 'src/test/firebase.stub';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environmentStub.firebase),
        AngularFirestoreModule,
      ],
      providers: [{ provide: AngularFirestore, useValue: FirestoreStub }],
    });
    service = TestBed.inject(CommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
