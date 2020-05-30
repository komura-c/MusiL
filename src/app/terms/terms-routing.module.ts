import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TermsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsRoutingModule {}
