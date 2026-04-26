import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuillEditorComponent } from './quill-editor.component';

describe('QuillEditorComponent', () => {
  let component: QuillEditorComponent;
  let fixture: ComponentFixture<QuillEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuillEditorComponent],
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
