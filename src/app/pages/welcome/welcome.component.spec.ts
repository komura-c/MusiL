import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WelcomeComponent } from '../../components/welcome/welcome.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from 'src/test/service.stub';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
