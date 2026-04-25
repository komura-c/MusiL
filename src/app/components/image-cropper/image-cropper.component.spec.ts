import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ImageCropperComponent } from './image-cropper.component';

describe('ImageCropperComponent', () => {
  let component: ImageCropperComponent;
  let fixture: ComponentFixture<ImageCropperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ImageCropperComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits loadImageFailed on error', () => {
    const spy = jasmine.createSpy('failed');
    component.loadImageFailed.subscribe(spy);
    component.onImageError();
    expect(component.hasError).toBeTrue();
    expect(spy).toHaveBeenCalled();
  });
});
