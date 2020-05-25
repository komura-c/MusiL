import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  homeItems = [
    {
      title: 'item 1',
    },
    {
      title: 'item 2',
    },
    {
      title: 'item 3',
    },
    {
      title: 'item 4',
    },
    {
      title: 'item 5',
    },
  ];
  constructor() {}
  ngOnInit(): void {}
}
