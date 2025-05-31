import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { AuthStub } from 'src/test/service.stub';
import { ViewCountService } from './view-count.service';

describe('ViewCountService', () => {
  let service: ViewCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Auth, useValue: AuthStub }],
    });
    service = TestBed.inject(ViewCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
