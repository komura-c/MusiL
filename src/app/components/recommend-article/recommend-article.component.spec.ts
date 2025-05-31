import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { AuthStub } from 'src/test/service.stub';
import { RecommendArticleComponent } from './recommend-article.component';

describe('RecommendArticleComponent', () => {
  let component: RecommendArticleComponent;
  let fixture: ComponentFixture<RecommendArticleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RecommendArticleComponent],
      providers: [{ provide: Auth, useValue: AuthStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
