import { Component, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormGuard {
  canDeactivate(
    component: Component & { form: { pristine: boolean }; isComplete: boolean }
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
