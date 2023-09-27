import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AuthPage {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  async register(email: string, password: string) {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      await this.authService.register(email, password);
      this.router.navigateByUrl('/home');
    } catch (error: any) {
      this.handleError(error.code)
    }
    await loading.dismiss();
  }

  async login(email: string, password: string) {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      await this.authService.login(email, password);
      this.router.navigateByUrl('/home');
    } catch (error: any) {
      this.handleError(error.code)
    }
    await loading.dismiss();

  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);
    form.reset()

    this.isLogin ? this.login(email, password) : this.register(email, password)
  }



  private handleError(code: string) {
    if (code === "auth/email-already-in-use") {
      let message = "Email informado já foi cadastrado!"
      this.showAlert(message)
    } else if (code === "auth/wrong-password") {
      let message = "A senha é inválida ou o usuário não possui senha."
      this.showAlert(message)
    } else if (code === "auth/user-not-found") {
      let message = "Não há registro de usuário correspondente a este identificador. O usuário pode ter sido excluído."
      this.showAlert(message)
    } else {
      let message = `Houve um erro inesperado: ${code}`
      this.showAlert(message)
    }

  }

  private showAlert(message: string) {
    this.alertController.create({
      header: 'Autenticação não concluída',
      message: message,
      buttons: ['OK']
    }).then(alert => alert.present())

  }


}
