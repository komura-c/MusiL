import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { Article } from 'functions/src/interfaces/article';
import { UserData } from 'functions/src/interfaces/user';
import { LoadingService } from 'src/app/services/loading.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  uid = this.authService.uid;
  articles$: Observable<Article[]> = this.articleService.getMyArticles(this.uid).pipe(
    tap(() => this.loadingService.toggleLoading(false))
  );
  user$: Observable<UserData> = this.userService.getUserData(this.uid);

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
  ) {
    this.loadingService.toggleLoading(true);
  }

  ngOnInit(): void {
  }

  openDeleteDialog(article: Article) {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: article,
    });
  }

}
