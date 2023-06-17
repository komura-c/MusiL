import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkInsertDialogComponent } from './link-insert-dialog.component';

describe('LinkInsertDialogComponent', () => {
  let component: LinkInsertDialogComponent;
  let fixture: ComponentFixture<LinkInsertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkInsertDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkInsertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
