import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string, // Um token de ID de autenticação do Firebase para o usuário recém-criado.
  email: string, // O e-mail do usuário recém-criado.
  refreshToken: string, // Um token de atualização do Firebase Auth para o usuário recém-criado.
  expiresIn: string, //O número de segundos em que o token de ID expira.
  localId: string // O uid do usuário recém-criado
  registered?: boolean // 	Se o e-mail é para uma conta existente.
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<User>(null!)

  private _apiKey = environment.firebaseConfig.apiKey

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        console.log(user)
        if (user) {
          return !!user.token; //retorna true se houver um token registrado
        } else {
          return false;
        }
      })
    );
  }

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.firebaseConfig.signupURL + this._apiKey,
      { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));

  }

  signin(email: string, password: string) {
    console.log(`${environment.firebaseConfig.singinURL}${this._apiKey}`)
    return this.http.post<AuthResponseData>(environment.firebaseConfig.singinURL + this._apiKey,
      { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  autoLogin() {
    return from(Preferences.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          /* this.autoLogout(user.tokenDuration); */
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    this._user.next(
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
      )
    );
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    Preferences.set({ key: 'authData', value: data });
  }



}
