import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription
  private previousAuthState = false

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController

  ) { }

  ngOnInit(): void {
    /*   this.authSubscription = this.authService.userIsAuthenticated.subscribe(isAuth => {
        if (!isAuth && this.previousAuthState !== isAuth) {
          this.router.navigateByUrl('/auth')
        }
        this.previousAuthState = isAuth
      }) */
  }

  ngOnDestroy(): void {
    /*  if (this.authSubscription) {
       this.authSubscription.unsubscribe()
     } */
  }

  async logout() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    await this.authService.logout();
    await loading.dismiss();
    this.router.navigateByUrl('/', { replaceUrl: true });

  }
}
