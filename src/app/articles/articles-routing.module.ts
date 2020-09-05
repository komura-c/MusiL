import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticlesComponent } from './articles/articles.component';
import { CreateComponent } from './create/create.component';
import { FormGuard } from '../guards/form.guard';

const routes: Routes = [
  {
    path: ':id/edit',
    component: CreateComponent,
    canDeactivate: [FormGuard],
  },
  {
    path: 'create',
    component: CreateComponent,
    canDeactivate: [FormGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    component: ArticlesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesRoutingModule { }
