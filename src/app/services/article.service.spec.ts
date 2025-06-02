import { TestBed } from '@angular/core/testing';
import { ArticleServiceStub } from 'src/test/service.stub';
import { ArticleService } from './article.service';

describe('ArticleService', () => {
  let service: any; // Using any since we're testing the stub

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ArticleService, useValue: ArticleServiceStub }
      ],
    });
    service = TestBed.inject(ArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
