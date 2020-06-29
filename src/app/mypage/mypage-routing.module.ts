import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MypageComponent } from './mypage/mypage.component';
import { NoteComponent } from './note/note.component';

const routes: Routes = [
  {
    path: 'n/:id',
    component: NoteComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    component: MypageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MypageRoutingModule { }
