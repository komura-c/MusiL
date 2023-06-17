import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import {
  MatLegacySnackBarModule as MatSnackBarModule,
  MAT_LEGACY_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/legacy-snack-bar';
import { FooterComponent } from './footer/footer.component';
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/compat/analytics';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {
  AngularFireFunctionsModule,
  REGION,
} from '@angular/fire/compat/functions';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { SearchInputComponent } from './search-input/search-input.component';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { MatPaginatorIntlJaModule } from './mat-paginator-intl-ja/mat-paginator-intl-ja.module';

// Top
import { SharedArticleCardModule } from './shared-article-card/shared-article-card.module';
import { TopComponent } from './top/top.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SearchInputComponent,
    TopComponent,
    WelcomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AngularFireAuthModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    // Top
    SharedArticleCardModule,
  ],
  providers: [
    { provide: REGION, useValue: 'asia-northeast1' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 4000 } },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlJaModule },
    ScreenTrackingService,
    UserTrackingService,
    // { provide: USE_EMULATOR, useValue: ['localhost', 5001] },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
