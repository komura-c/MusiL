import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Article } from '@interfaces/article';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loadingSource = new Subject();
  loading$ = this.loadingSource.asObservable();

  constructor() {}

  toggleLoading(status: boolean) {
    this.loadingSource.next(status);
  }
}
