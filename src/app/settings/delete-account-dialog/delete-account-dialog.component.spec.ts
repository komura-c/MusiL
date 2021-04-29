import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteAccountDialogComponent } from './delete-account-dialog.component';

describe('DeleteAccountDialogComponent', () => {
  let component: DeleteAccountDialogComponent;
  let fixture: ComponentFixture<DeleteAccountDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DeleteAccountDialogComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
