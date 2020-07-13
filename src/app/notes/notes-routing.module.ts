import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotesComponent } from './notes/notes.component';
import { CreateComponent } from './create/create.component';
import { FormGuard } from '../guards/form.guard';

const routes: Routes = [
  {
    path: 'create',
    component: CreateComponent,
    canDeactivate: [FormGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    component: NotesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotesRoutingModule { }
