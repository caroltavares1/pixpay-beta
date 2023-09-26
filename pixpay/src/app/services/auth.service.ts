import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  async register(email: string, password: string) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      console.error(e)
      return null;
    }
  }

  async login(email: string, password: string) {

    return await signInWithEmailAndPassword(this.auth, email, password);

    /* try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e: any) {
      console.log(e.code)
      return null;
    } */
  }

  logout() {
    return signOut(this.auth);
  }
}
