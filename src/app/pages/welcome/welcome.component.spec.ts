import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WelcomeComponent } from '../../components/welcome/welcome.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from 'src/test/service.stub';
import { getCommonProviders } from 'src/test/test-helpers';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WelcomeComponent],
      providers: [
        ...getCommonProviders(),
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
