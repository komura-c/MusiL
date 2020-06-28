import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/interfaces/user';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.scss']
})
export class MypageComponent implements OnInit {
  user$: Observable<UserData>;
  userId: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) {
    route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      this.user$ = this.userService.getUserByScreenName(
        this.userId
      );
    });
  }

  ngOnInit(): void {
  }

}
