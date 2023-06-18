import { importProvidersFrom, ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import {
  ScreenTrackingService,
  UserTrackingService,
  AngularFireAnalyticsModule,
} from '@angular/fire/compat/analytics';
import {
  REGION,
  AngularFireFunctionsModule,
} from '@angular/fire/compat/functions';

import { environment } from 'src/environments/environment';
import { routes } from './app.routes';

import { MatPaginatorIntlJaModule } from './mat-paginator-intl-ja/mat-paginator-intl-ja.module';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import {
  MatLegacySnackBarModule as MatSnackBarModule,
  MAT_LEGACY_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/legacy-snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireAnalyticsModule,
      AngularFirestoreModule,
      AngularFireStorageModule,
      AngularFireFunctionsModule,
      AngularFireAuthModule,
      MatSnackBarModule
    ),
    { provide: REGION, useValue: 'asia-northeast1' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 4000 } },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlJaModule },
    // { provide: USE_EMULATOR, useValue: ['localhost', 5001] },
    ScreenTrackingService,
    UserTrackingService,
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
