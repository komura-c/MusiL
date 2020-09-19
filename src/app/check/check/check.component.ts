import { Component, OnInit } from '@angular/core';
import { Article } from '@interfaces/article';
import { UserData } from '@interfaces/user';
import { Observable } from 'rxjs';
import { CheckService } from 'src/app/services/check.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {
  usersScreenNameIsNull$: Observable<UserData[]> = this.checkService.getUserScreenNameIsNull();
  articlesThumbnailURLIsNull$: Observable<Article[]> = this.checkService.getArticleThumbnailURLIsNull();

  constructor(
    private checkService: CheckService,
  ) { }

  ngOnInit(): void {
  }
}
