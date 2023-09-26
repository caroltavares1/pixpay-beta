import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
import { User } from '../models/user.model';

export interface AuthResponseData {
  idToken: string, // Um token de ID de autenticação do Firebase para o usuário recém-criado.
  email: string, // O e-mail do usuário recém-criado.
  refreshToken: string, // Um token de atualização do Firebase Auth para o usuário recém-criado.
  expiresIn: string, //O número de segundos em que o token de ID expira.
  localId: string // O uid do usuário recém-criado
  registered?: boolean // 	Se o e-mail é para uma conta existente.
}

export interface RefreshResponseData {
  expires_in: string, //O número de segundos em que o token de ID expira.
  token_type: string // O tipo do token. Sempre Bearer
  refresh_token: string, // 	O token de atualização do Firebase Auth fornecido na solicitação ou um novo token de atualização.
  id_token: string, // Um token de ID de autenticação do Firebase.
  user_id: string, // O uid correspondente ao token de ID fornecido.
  project_id: string //Seu ID do projeto do Firebase.
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private _user = new BehaviorSubject<User>(null!)
  private activeLogoutTimer: any;
  private _apiKey = environment.firebaseConfig.apiKey

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token; //retorna true se houver um token registrado
        } else {
          return false;
        }
      })
    );
  }

  constructor(private http: HttpClient) { }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.firebaseConfig.signupURL + this._apiKey,
      { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));

  }

  signin(email: string, password: string) {
    const headers = { 'Content-Type': 'application/json', }
    return this.http.post<AuthResponseData>(environment.firebaseConfig.singinURL + this._apiKey,
      { email: email, password: password, returnSecureToken: true }, { headers }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  /*     refreshToken(idToken: string) {
        return this.http.post<RefreshResponseData>(environment.firebaseConfig.refreshTokenURL + this._apiKey,
          { grant_type: 'refresh_token', refresh_token: idToken }).subscribe(res => {
            console.log(res)
          })
  
      } */

  logout() {
    this._user.next(null!)
    Preferences.remove({ key: 'authData' })
  }

  autoLogin() {
    return from(Preferences.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData?.value /* !storedData || !storedData.value */) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          refreshToken: string
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
          parsedData.refreshToken,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      userData.refreshToken,
      expirationTime
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      userData.refreshToken,
      expirationTime.toISOString(),
      userData.email
    );
  }


  private storeAuthData(
    userId: string,
    token: string,
    refreshToken: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      refreshToken: refreshToken,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    Preferences.set({ key: 'authData', value: data });
  }



}
