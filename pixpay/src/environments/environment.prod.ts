export const environment = {
  production: true,
  title: 'Ambiente de Produção',
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
