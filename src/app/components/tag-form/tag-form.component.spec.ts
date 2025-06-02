import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { SearchService } from 'src/app/services/search.service';
import { SearchServiceStub } from 'src/test/service.stub';
import { TagFormComponent } from './tag-form.component';

describe('TagFormComponent', () => {
  let component: TagFormComponent;
  let fixture: ComponentFixture<TagFormComponent>;
  let formBuilder: UntypedFormBuilder;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatAutocompleteModule, ReactiveFormsModule, TagFormComponent],
      providers: [
        UntypedFormBuilder,
        { provide: SearchService, useValue: SearchServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagFormComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(UntypedFormBuilder);
    
    // Set up required inputs
    component.parentForm = formBuilder.group({
      tag: ['']
    });
    component.tags = [];
    component.tagMaxWordCount = 50;
    component.tagMaxLength = 10;
    
    // Don't call detectChanges() yet
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
