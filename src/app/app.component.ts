import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dtmplace';
  activatedRouteData: Observable<Data>;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.forEach(event => {
      if ((event instanceof NavigationEnd)) {
        this.activatedRouteData = this.activatedRoute.firstChild.data;
      }
    });
  }
}
