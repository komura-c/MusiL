import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { SearchService } from 'src/app/services/search.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss'],
})
export class TagFormComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;
  @Input() tags: string[];
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  private subscription: Subscription;
  private index = this.searchService.index.latest;
  allTags: {
    value: string;
    highlighted: string;
    count: number;
    selected?: boolean;
  }[];
  selectable = true;
  removable = true;
  isTagWordOver = false;

  get tagControl() {
    return this.parentForm.get('tag') as FormControl;
  }

  constructor(private searchService: SearchService) {}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const maxWordCount = 50;
    const maxLength = 10;
    if (value.length > maxWordCount) {
      this.isTagWordOver = true;
    } else if ((value || '').trim() && this.tags.length < maxLength) {
      this.isTagWordOver = false;
      this.tags.push(value);
      this.tagControl.patchValue(null);
    }
    if (input) {
      input.value = '';
    }
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
    this.subscription.unsubscribe();
  }
}
