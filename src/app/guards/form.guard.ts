import { Injectable } from '@angular/core';
import {
  CanDeactivate,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CreateComponent } from '../articles/create/create.component';

@Injectable({
  providedIn: 'root',
})
export class FormGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: CreateComponent,
  ): Observable<boolean> | boolean {
    if (component.form.pristine || component.isComplete) {
      return true;
    }
    const confirmation = window.confirm(
      '作業中の内容が失われますがよろしいですか？'
    );
    return of(confirmation);
  }
}
