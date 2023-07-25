import { Component, OnDestroy } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { CommonModule } from '@angular/common';
import { ContasComponent } from '../contas/contas.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ContasComponent],
  providers: [ScreenOrientation]
})
export class HomePage implements OnDestroy {
  result: any
  scanActive = false
  isSupported = false

  constructor(
    private alertController: AlertController,
    private screenOrientation: ScreenOrientation
  ) { }

  ngOnDestroy(): void {
    this.stopScan()
  }

  async startScan() {

    // Check camera permission
    // This is just a simple example, check out the better checks below
    const status = await BarcodeScanner.checkPermission({ force: true });
    console.log("Testando")
    if (status.granted) {
      this.scanActive = true
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      document.querySelector('body')?.classList.add('scanner-active')
      // make background of WebView transparent
      // note: if you are using ionic this might not be enough, check below
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

      // if the result has content
      if (result.hasContent) {
        console.log(result.content); // log the raw scanned content
        this.result = result.content
        this.screenOrientation.unlock();
        this.scanActive = false
        document.querySelector('body')?.classList.remove('scanner-active');

      }
    } else {
      await this.presentAlert()
    }

  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permissão Negada',
      message: 'Por favor conceda permissão de câmera para usar o scanner.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Abrir configurações do app',
          handler: () => {
            BarcodeScanner.openAppSettings()
          }
        }
      ],
    });
    await alert.present();
  }

  async stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.screenOrientation.unlock();
    this.scanActive = false
    document.querySelector('body')?.classList.remove('scanner-active');
  }
}
