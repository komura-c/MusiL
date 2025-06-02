import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { getCommonProviders } from 'src/test/test-helpers';
import TermsComponent from './terms.component';

describe('TermsComponent', () => {
  let component: TermsComponent;
  let fixture: ComponentFixture<TermsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TermsComponent],
      providers: [...getCommonProviders()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
