import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { LinkInsertDialogComponent } from './link-insert-dialog.component';

describe('LinkInsertDialogComponent', () => {
  let component: LinkInsertDialogComponent;
  let fixture: ComponentFixture<LinkInsertDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<LinkInsertDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [LinkInsertDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkInsertDialogComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
