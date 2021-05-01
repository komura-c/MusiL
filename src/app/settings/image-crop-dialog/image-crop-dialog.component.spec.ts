import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCropDialogComponent } from './image-crop-dialog.component';

describe('ImageCropDialogComponent', () => {
  let component: ImageCropDialogComponent;
  let fixture: ComponentFixture<ImageCropDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImageCropDialogComponent],
        providers: [MatDialog, MAT_DIALOG_DATA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
