import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
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
