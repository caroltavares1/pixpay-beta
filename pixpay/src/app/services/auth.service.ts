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

    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string) {

    return await signInWithEmailAndPassword(this.auth, email, password);

  }

  logout() {
    return signOut(this.auth);
  }
}
