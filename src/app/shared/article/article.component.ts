import { Component, OnInit, Input } from '@angular/core';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  @Input() article: ArticleWithAuthor;

  constructor() { }

  ngOnInit(): void { }
}
