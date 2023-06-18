import { Component } from '@angular/core';
import { Article } from '@interfaces/article';
import { UserData } from '@interfaces/user';
import { Observable } from 'rxjs';
import { CheckService } from 'src/app/services/check.service';
import { UntypedFormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { NgIf, NgFor, AsyncPipe, JsonPipe } from '@angular/common';

@Component({
    selector: 'app-check',
    templateUrl: './check.component.html',
    styleUrls: ['./check.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        ReactiveFormsModule,
        FormsModule,
        MatLegacyFormFieldModule,
        MatLegacyInputModule,
        MatLegacyButtonModule,
        AsyncPipe,
        JsonPipe,
    ],
})
export class CheckComponent {
  usersScreenNameIsNull$: Observable<UserData[]> =
    this.checkService.getUserScreenNameIsNull();
  articlesThumbnailURLIsNull$: Observable<Article[]> =
    this.checkService.getArticleThumbnailURLIsNull();

  accessKeyControl: UntypedFormControl = new UntypedFormControl();
  screenNameControl: UntypedFormControl = new UntypedFormControl();
  profile: any;

  constructor(private checkService: CheckService) {}

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
