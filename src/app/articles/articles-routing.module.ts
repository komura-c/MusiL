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
    data: {
      showHeader: false,
      showFooter: false,
    },
  },
  {
    path: 'create',
    component: CreateComponent,
    canDeactivate: [FormGuard],
    data: {
      showHeader: false,
      showFooter: false,
    },
  },
  {
    path: '',
    pathMatch: 'full',
    component: ArticlesComponent,
    data: {
      showFooter: false,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesRoutingModule {}
