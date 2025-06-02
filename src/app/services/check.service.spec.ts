import { TestBed } from '@angular/core/testing';
import { CheckServiceStub } from 'src/test/service.stub';
import { CheckService } from './check.service';

describe('CheckService', () => {
  let service: any; // Using any since we're testing the stub

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CheckService, useValue: CheckServiceStub }],
    });
    service = TestBed.inject(CheckService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
