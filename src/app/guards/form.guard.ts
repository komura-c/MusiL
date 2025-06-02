import { Component, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WindowService } from '../services/window.service';

@Injectable({
  providedIn: 'root',
})
export class FormGuard {
  constructor(private windowService: WindowService) {}

  canDeactivate(
    component: Component & { form: { pristine: boolean }; isComplete: boolean }
  ): Observable<boolean> | boolean {
    if (component.form.pristine || component.isComplete) {
      return true;
    }
    const confirmation = this.windowService.confirm(
      '作業中の内容が失われますがよろしいですか？'
    );
    return of(confirmation);
  }
}
