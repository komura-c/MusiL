import { importProvidersFrom, ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { routes } from './app.routes';

import { MatPaginatorIntlJaModule } from './lib/mat-paginator-intl-ja.module';
import { MatPaginatorIntl as MatPaginatorIntl } from '@angular/material/paginator';
import {
  MatSnackBarModule as MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      // SnackbarはrootのServiceで使ってるため、globalで読み込む
      MatSnackBarModule
    ),
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 4000 } },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlJaModule },
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
      // withDebugTracing(),
      // withEnabledBlockingInitialNavigation(),
      // withHashLocation(),
    ),
    provideAnimations(),
  ],
};
