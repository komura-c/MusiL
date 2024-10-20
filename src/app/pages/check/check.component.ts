import { Component, inject } from '@angular/core';
import { Article } from '@interfaces/article';
import { UserData } from '@interfaces/user';
import { Observable } from 'rxjs';
import { CheckService } from 'src/app/services/check.service';
import { NgIf, NgFor, AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, JsonPipe],
})
export default class CheckComponent {
  private readonly checkService = inject(CheckService);
  readonly usersScreenNameIsNull$: Observable<UserData[]> =
    this.checkService.getUserScreenNameIsNull();
  readonly articlesThumbnailURLIsNull$: Observable<Article[]> =
    this.checkService.getArticleThumbnailURLIsNull();
}
