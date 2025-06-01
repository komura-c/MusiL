import { TestBed } from '@angular/core/testing';
import { UserServiceStub } from 'src/test/service.stub';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: any; // Using any since we're testing the stub

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: UserServiceStub }
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
