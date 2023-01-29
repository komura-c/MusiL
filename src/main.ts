import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// TODO: 後に置き換え用
// bootstrapApplication(AppComponent, {
//   providers: [
//     { provide: REGION, useValue: 'asia-northeast1' },
//     { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 4000 } },
//     { provide: MatPaginatorIntl, useClass: MatPaginatorIntlJaModule },
//     ScreenTrackingService,
//     UserTrackingService,
//     // { provide: USE_EMULATOR, useValue: ['localhost', 5001] },
//     importProvidersFrom([
//       BrowserModule,
//       AppRoutingModule,
//       BrowserAnimationsModule,
//       AngularFireModule.initializeApp(environment.firebase),
//       AngularFireAnalyticsModule,
//       AngularFirestoreModule,
//       AngularFireStorageModule,
//       AngularFireFunctionsModule,
//       AngularFireAuthModule,
//       MatSnackBarModule,
//       MatListModule,
//       FormsModule,
//       ReactiveFormsModule,
//       MatAutocompleteModule,
//       MatProgressSpinnerModule,
//     ]),
//     provideHttpClient(),
//   ],
// }).catch((err) => console.error(err));
