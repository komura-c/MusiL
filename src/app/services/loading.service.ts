import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loadingSource = new Subject();
  loading$ = this.loadingSource.asObservable();

  toggleLoading(status: boolean) {
    this.loadingSource.next(status);
  }
}
