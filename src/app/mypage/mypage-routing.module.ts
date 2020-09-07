import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MypageComponent } from './mypage/mypage.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { MyArticlesComponent } from './my-articles/my-articles.component';
import { LikedArticlesComponent } from './liked-articles/liked-articles.component';

const routes: Routes = [
  {
    path: 'a/:id',
    component: ArticleDetailComponent,
  },
  {
    path: '',
    component: MypageComponent,
    children: [
      {
        path: 'likes',
        component: LikedArticlesComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        component: MyArticlesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MypageRoutingModule {}
