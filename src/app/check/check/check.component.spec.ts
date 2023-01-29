import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CheckService } from 'src/app/services/check.service';
import { CheckServiceStub } from 'src/test/service.stub';
import { CheckComponent } from './check.component';

describe('CheckComponent', () => {
  let component: CheckComponent;
  let fixture: ComponentFixture<CheckComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CheckComponent],
      providers: [{ provide: CheckService, useValue: CheckServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
