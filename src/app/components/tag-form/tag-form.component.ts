import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatLegacyAutocomplete as MatAutocomplete,
  MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent,
  MatLegacyAutocompleteModule,
} from '@angular/material/legacy-autocomplete';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { SearchService } from 'src/app/services/search.service';
import {
  MatLegacyChipInputEvent as MatChipInputEvent,
  MatLegacyChipList as MatChipList,
  MatLegacyChipsModule,
} from '@angular/material/legacy-chips';
import { Subscription } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatLegacyFormFieldModule,
    MatLegacyChipsModule,
    NgFor,
    NgIf,
    MatIconModule,
    MatLegacyAutocompleteModule,
    MatLegacyOptionModule,
  ],
})
export class TagFormComponent implements OnInit, OnDestroy {
  @Input() parentForm: UntypedFormGroup;
  @Input() tags: string[];
  @Input() tagMaxWordCount: number;
  @Input() tagMaxLength: number;
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipList') chipList: MatChipList;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  private readonly index = this.searchService.index.latest;
  private subscription: Subscription;
  allTags: {
    value: string;
    highlighted: string;
    count: number;
    selected?: boolean;
  }[];
  selectable = true;
  removable = true;

  get tagControl() {
    return this.parentForm.get('tag') as UntypedFormControl;
  }

  constructor(private searchService: SearchService) {}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if (value.length > this.tagMaxWordCount) {
      this.chipList.errorState = true;
      return;
    }
    if ((value || '').trim() && this.tags.length < this.tagMaxLength) {
      this.chipList.errorState = false;
      this.tags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.tagControl.patchValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.tagControl.patchValue(null);
  }

  ngOnInit(): void {
    this.subscription = this.tagControl.valueChanges
      .pipe(startWith(''), debounceTime(500))
      .subscribe((keyword: string) => {
        this.index.searchForFacetValues('tags', keyword).then((result) => {
          this.allTags = result.facetHits;
        });
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
