// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration production` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  algolia: {
    index_name: 'dev_articles',
    appId: 'UMOJWKOBH4',
    searchKey: '42c89f13808aa48d0e0d98d5fde730fa',
  },
  firebase: {
    apiKey: 'AIzaSyCAb_-2_Z8IOP0fyitIdyWGuQ0kDsaBVFg',
    authDomain: 'dtmplace-ad671.firebaseapp.com',
    databaseURL: 'https://dtmplace-ad671.firebaseio.com',
    projectId: 'dtmplace-ad671',
    storageBucket: 'dtmplace-ad671.appspot.com',
    messagingSenderId: '494642326978',
    appId: '1:494642326978:web:8346d7171b833f396bfa5b',
    measurementId: 'G-E2YGGKZFEX',
  },
  hostingURL: 'https://dtmplace-ad671.web.app',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
