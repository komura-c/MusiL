import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteEditButtonsComponent } from './note-edit-buttons.component';

describe('NoteEditButtonsComponent', () => {
  let component: NoteEditButtonsComponent;
  let fixture: ComponentFixture<NoteEditButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteEditButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteEditButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
