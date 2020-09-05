import { Component, OnInit, Input } from '@angular/core';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
})
export class ArticleCardComponent implements OnInit {
  @Input() article: ArticleWithAuthor;

  constructor() { }

  ngOnInit(): void { }
}
