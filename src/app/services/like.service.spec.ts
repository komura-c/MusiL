import { TestBed } from '@angular/core/testing';
import { LikeServiceStub } from 'src/test/service.stub';
import { LikeService } from './like.service';

describe('LikeService', () => {
  let service: any; // Using any since we're testing the stub

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LikeService, useValue: LikeServiceStub }
      ],
    });
    service = TestBed.inject(LikeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
