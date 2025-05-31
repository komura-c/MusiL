import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import NotFoundComponent from './not-found.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from 'src/test/service.stub';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
