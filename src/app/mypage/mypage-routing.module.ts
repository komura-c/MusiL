import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MypageComponent } from './mypage/mypage.component';
import { NoteComponent } from './note/note.component';
import { MyArticleComponent } from './my-article/my-article.component';
import { LikesArticleComponent } from './likes-article/likes-article.component';

const routes: Routes = [
  {
    path: 'n/:id',
    component: NoteComponent,
  },
  {
    path: '',
    component: MypageComponent,
    children: [
      {
        path: 'likes',
        component: LikesArticleComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        component: MyArticleComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MypageRoutingModule {}
