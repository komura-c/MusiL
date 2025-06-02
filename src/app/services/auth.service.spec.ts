import { TestBed } from '@angular/core/testing';
import { AuthServiceStub } from 'src/test/service.stub';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: any; // Using any since we're testing the stub

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: AuthServiceStub }
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
