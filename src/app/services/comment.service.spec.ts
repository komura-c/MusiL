import { TestBed } from '@angular/core/testing';
import { CommentServiceStub } from 'src/test/service.stub';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: any; // Using any since we're testing the stub

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CommentService, useValue: CommentServiceStub }],
    });
    service = TestBed.inject(CommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
