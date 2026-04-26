import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule as MatMenuModule } from '@angular/material/menu';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';
import {
  AuthServiceStub,
  SearchServiceStub,
  UserServiceStub,
} from 'src/test/service.stub';
import { getCommonProviders } from 'src/test/test-helpers';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [MatMenuModule, RouterTestingModule, HeaderComponent],
      providers: [
        ...getCommonProviders(),
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: SearchService, useValue: SearchServiceStub },
        { provide: UserService, useValue: UserServiceStub },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet - some dependencies might not be ready
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
