import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropDialogComponent } from './image-crop-dialog.component';

describe('ImageCropDialogComponent', () => {
  let component: ImageCropDialogComponent;
  let fixture: ComponentFixture<ImageCropDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCropDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
