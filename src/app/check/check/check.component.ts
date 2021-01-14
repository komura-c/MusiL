import { Component, OnInit } from '@angular/core';
import { Article } from '@interfaces/article';
import { UserData } from '@interfaces/user';
import { Observable } from 'rxjs';
import { CheckService } from 'src/app/services/check.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent implements OnInit {
  usersScreenNameIsNull$: Observable<
    UserData[]
  > = this.checkService.getUserScreenNameIsNull();
  articlesThumbnailURLIsNull$: Observable<
    Article[]
  > = this.checkService.getArticleThumbnailURLIsNull();

  accessKeyControl: FormControl = new FormControl();
  screenNameControl: FormControl = new FormControl();
  profile: any;

  constructor(private checkService: CheckService) {}

  ngOnInit(): void {}

  async getProfile(accessKey: string, screenName: string): Promise<string> {
    if (
      accessKey === null ||
      /^ {1,}$/.test(accessKey) ||
      screenName === null ||
      /^ {1,}$/.test(screenName)
    ) {
      return;
    }
    this.profile = await this.checkService.getProfile({
      access_token_key: accessKey,
      screen_name: screenName,
    });
    return;
  }
}
