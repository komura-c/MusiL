import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Observable } from 'rxjs';
import { ArticleWithAuthor } from 'functions/src/interfaces/article-with-author';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  articles$: Observable<ArticleWithAuthor[]> = this.articleService.getArticlesWithAuthors();

  constructor(
    private articleService: ArticleService,
  ) { }

  ngOnInit(): void { }
}
