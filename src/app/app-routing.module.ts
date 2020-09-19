import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { SearchGuard } from './guards/search.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./search-result/search-result.module').then(
        (m) => m.SearchResultModule
      ),
    canActivate: [SearchGuard],
  },
  {
    path: 'tags/:id',
    loadChildren: () =>
      import('./search-result/search-result.module').then(
        (m) => m.SearchResultModule
      ),
    canActivate: [SearchGuard],
  },
  {
    path: 'privacy',
    loadChildren: () =>
      import('./privacy/privacy.module').then((m) => m.PrivacyModule),
  },
  {
    path: 'terms',
    loadChildren: () =>
      import('./terms/terms.module').then((m) => m.TermsModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'articles',
    loadChildren: () =>
      import('./articles/articles.module').then((m) => m.ArticlesModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      showFooter: false,
    },
  },
  {
    path: 'admin/check',
    loadChildren: () =>
      import('./check/check.module').then((m) => m.CheckModule),
    canLoad: [AdminGuard],
    canActivate: [AdminGuard],
    data: {
      showHeader: false,
      showFooter: false,
    },
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./mypage/mypage.module').then((m) => m.MypageModule),
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./top/top.module').then((m) => m.TopModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      useHash: false,
      scrollOffset: [0, 70],
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
