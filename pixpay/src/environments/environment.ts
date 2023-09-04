// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  title: 'Ambiente de Desenvolvimento',
  apiURL: 'http://192.168.1.11:8084/rest',
  //apiURL: 'http://192.168.41.60:8090/rest',
  //authorization: "Basic " + btoa("saulomaciel:17072610")
  authorization: "Basic " + btoa("admin:123"),
  firebaseConfig: {
    apiKey: "AIzaSyB7MaHMQIs4bM2we5Vnz61lEd38pCmDrvw",
    signupURL: "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=",
    singinURL: "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=",
    refreshTokenURL: "https://securetoken.googleapis.com/v1/token?key="
  },
  firebase: {
    apiKey: "AIzaSyB7MaHMQIs4bM2we5Vnz61lEd38pCmDrvw",
    authDomain: "pixpay-19727.firebaseapp.com",
    projectId: "pixpay-19727",
    storageBucket: "pixpay-19727.appspot.com",
    messagingSenderId: "543299304531",
    appId: "1:543299304531:web:274807177d28a8e5f19aa6",
    measurementId: "G-WXCN7FV3X7"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7MaHMQIs4bM2we5Vnz61lEd38pCmDrvw",
  authDomain: "pixpay-19727.firebaseapp.com",
  projectId: "pixpay-19727",
  storageBucket: "pixpay-19727.appspot.com",
  messagingSenderId: "543299304531",
  appId: "1:543299304531:web:274807177d28a8e5f19aa6",
  measurementId: "G-WXCN7FV3X7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
