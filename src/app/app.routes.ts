import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SearchGuard } from './guards/search.guard';
import { AdminGuard } from './guards/admin.guard';
import { FormGuard } from './guards/form.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./top/top.component'),
  },
  {
    path: 'articles',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./articles/articles/articles.component'),
      },
      {
        path: 'create',
        loadComponent: () => import('./articles/create/create.component'),
        canDeactivate: [FormGuard],
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./articles/create/create.component'),
        canDeactivate: [FormGuard],
      },
    ],
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about/about.component'),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./search-result/search-result/search-result.component'),
    canActivate: [SearchGuard],
  },
  {
    path: 'tags/:id',
    loadComponent: () =>
      import('./search-result/search-result/search-result.component'),
    canActivate: [SearchGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings/settings.component'),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'privacy',
    loadComponent: () => import('./privacy/privacy/privacy.component'),
  },
  {
    path: 'terms',
    loadComponent: () => import('./terms/terms/terms.component'),
  },
  {
    path: 'admin/check',
    loadComponent: () => import('./check/check/check.component'),
    canLoad: [AdminGuard],
    canActivate: [AdminGuard],
  },
  {
    path: ':id',
    children: [
      {
        path: 'a/:id',
        loadComponent: () =>
          import('./mypage/article-detail/article-detail.component'),
      },
      {
        path: '',
        loadComponent: () => import('./mypage/mypage/mypage.component'),
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./mypage/my-articles/my-articles.component'),
            data: {
              isMyArticlesRoute: true,
            },
          },
          {
            path: 'likes',
            loadComponent: () =>
              import('./mypage/liked-articles/liked-articles.component'),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component'),
  },
];
