import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { AuthServiceStub } from 'src/test/service.stub';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HeaderComponent],
        imports: [MatMenuModule],
        providers: [{ provide: AuthService, useValue: AuthServiceStub }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
