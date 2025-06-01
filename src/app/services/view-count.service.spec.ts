import { TestBed } from '@angular/core/testing';
import { ViewCountServiceStub } from 'src/test/service.stub';
import { ViewCountService } from './view-count.service';

describe('ViewCountService', () => {
  let service: any; // Using any since we're testing the stub

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ViewCountService, useValue: ViewCountServiceStub }
      ],
    });
    service = TestBed.inject(ViewCountService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
