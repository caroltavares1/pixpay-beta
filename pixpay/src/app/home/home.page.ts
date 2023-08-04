import { Component, OnDestroy } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { CommonModule } from '@angular/common';
import { ContasComponent } from '../contas/contas.component';
import { CobrancaComponent } from '../cobranca/cobranca.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ContasComponent, CobrancaComponent]
})
export class HomePage {

  constructor(
    private router: Router
  ) { }

  scan() {
    this.router.navigate(['contas'], { queryParams: { scan: 'allowed' } })
  }

}
