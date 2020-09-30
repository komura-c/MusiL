import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { FooterComponent } from './footer/footer.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import {
  AngularFirestoreModule,
  SETTINGS as FIRESTORE_SETTINGS,
} from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {
  AngularFireFunctionsModule,
  REGION,
  ORIGIN,
} from '@angular/fire/functions';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SearchInputComponent } from './search-input/search-input.component';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlJaModule } from './mat-paginator-intl-ja/mat-paginator-intl-ja.module';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SearchInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AngularFireAuthModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    { provide: REGION, useValue: 'asia-northeast1' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 4000 } },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlJaModule },
    // {
    //   provide: ORIGIN,
    //   useValue: environment.production ? undefined : 'http://localhost:5001',
    // },
    // {
    //   provide: FIRESTORE_SETTINGS,
    //   useValue: environment.production ? {} : { host: 'localhost:8080', ssl: false },
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
