// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiUrl: 'http://localhost:8080'
 //apiUrl: 'http://185.254.204.15:8080'
  apiUrl: 'http://181.166.35.35:83'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
export const firebaseConfig = {
  apiKey: 'AIzaSyDNZZsx5SoIYN6BHorLq3kgDpAuCmvLBsw',
  authDomain: 'rutapp-2021.firebaseapp.com',
  projectId: 'rutapp-2021',
  storageBucket: 'rutapp-2021.appspot.com',
  messagingSenderId: '102831843420',
  appId: '1:102831843420:web:9a8a2d428c4384c5ad5e99',
  measurementId: 'G-XWGK78WLF8'
};
