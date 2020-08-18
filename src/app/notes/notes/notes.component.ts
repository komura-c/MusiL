import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Article } from 'functions/src/interfaces/article';
import { UserData } from 'functions/src/interfaces/user';
import { LoadingService } from 'src/app/services/loading.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  uid = this.authService.uid;
  user$: Observable<UserData> = this.authService.user$;
  articles$: Observable<Article[]> = this.articleService
    .getMyArticles(this.uid)
    .pipe(tap(() => this.loadingService.toggleLoading(false)));

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
    this.loadingService.toggleLoading(true);
  }

  ngOnInit(): void { }
}
