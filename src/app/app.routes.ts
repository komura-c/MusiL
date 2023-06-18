import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SearchGuard } from './guards/search.guard';
import { AdminGuard } from './guards/admin.guard';
import { FormGuard } from './guards/form.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/top/top.component'),
  },
  {
    path: 'articles',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/articles/articles.component'),
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/create/create.component'),
        canDeactivate: [FormGuard],
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./pages/create/create.component'),
        canDeactivate: [FormGuard],
      },
    ],
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component'),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search-result/search-result.component'),
    canActivate: [SearchGuard],
  },
  {
    path: 'tags/:id',
    loadComponent: () =>
      import('./pages/search-result/search-result.component'),
    canActivate: [SearchGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component'),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component'),
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms.component'),
  },
  {
    path: 'admin/check',
    loadComponent: () => import('./pages/check/check.component'),
    canLoad: [AdminGuard],
    canActivate: [AdminGuard],
  },
  {
    path: ':id',
    children: [
      {
        path: 'a/:id',
        loadComponent: () =>
          import('./pages/article-detail/article-detail.component'),
      },
      {
        path: '',
        loadComponent: () => import('./pages/mypage/mypage.component'),
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./pages/my-articles/my-articles.component'),
            data: {
              isMyArticlesRoute: true,
            },
          },
          {
            path: 'likes',
            loadComponent: () =>
              import('./pages/liked-articles/liked-articles.component'),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component'),
  },
];
