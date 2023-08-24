import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    console.log('init')
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, })
      .then(loadingEl => {
        loadingEl.present();
        let auth: Observable<AuthResponseData>
        if (this.isLogin) {
          auth = this.authService.signin(email, password)
        } else {
          auth = this.authService.signup(email, password)
        }
        auth.subscribe({
          next: (data => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/home');
            console.log(data)
          }),
          error: (err => {
            loadingEl.dismiss()
            let code = err.error.error.message
            this.handleError(code)
          })
        }

        )
      });

  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);

    this.authenticate(email, password)
  }


  private handleError(code: string) {
    if (code === "EMAIL_EXISTS") {
      let message = "Email informado já foi cadastrado!"
      this.showAlert(message)
    } else if (code === "INVALID_PASSWORD") {
      let message = "A senha é inválida ou o usuário não possui senha."
      this.showAlert(message)
    } else if (code === "EMAIL_NOT_FOUND") {
      let message = "Não há registro de usuário correspondente a este identificador. O usuário pode ter sido excluído."
      this.showAlert(message)
    } else if (code === "TOO_MANY_ATTEMPTS_TRY_LATER") {
      let message = "bloqueamos todas as solicitações deste dispositivo devido a atividades incomuns. Tente mais tarde."
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
