import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore/lite';
import { Storage } from '@angular/fire/storage';
import { Functions } from '@angular/fire/functions';
import { Analytics } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  readonly auth = inject(Auth);
  readonly firestore = inject(Firestore);
  readonly storage = inject(Storage);
  readonly functions = inject(Functions);
  readonly analytics = inject(Analytics);
}
