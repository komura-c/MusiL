import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { Article } from 'src/app/interfaces/article';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from 'src/app/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  uid = this.authService.uid;
  articles$: Observable<Article[]> = this.articleService.getMyArticles(this.uid);
  user$: Observable<UserData> = this.userService.getUserData(this.uid);

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

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
