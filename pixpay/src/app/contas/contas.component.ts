import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContasAReceberService } from '../services/contas-areceber.service';
import { IonicModule, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { ContasReceber } from '../services/contas-receber.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-contas',
  templateUrl: './contas.component.html',
  styleUrls: ['./contas.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [ScreenOrientation]
})
export class ContasComponent implements OnInit, OnDestroy {

  notaFiscal: any
  scanActive = false
  allowScan = ''
  isToastOpen = false
  contasreceber: ContasReceber[]
  plataform = ''

  constructor(
    private contasAreceber: ContasAReceberService,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService,
    private screenOrientation: ScreenOrientation
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.allowScan = params['scan']
    })
    if (this.allowScan == "allowed") {
      this.scanActive = true
      this.startScan()
    }
  }

  ngOnDestroy(): void {
    this.stopScan()
  }

  mostrarContasReceber(notaFiscal: string) {
    this.contasAreceber.getUser('01', /* '83800000001577900110019166310101016117428313' */ notaFiscal).subscribe({
      next: (v: ContasReceber[]) => {
        if (v != null) {
          this.contasreceber = v
          this.contasreceber.forEach(element => {
            console.log("data", element.dtVenc)
            element.dtVenc = this.util.converteData(element.dtVenc)
            element.cgc = this.util.formataCNPJ(element.cgc)
            return element
          });
        } else {
          this.setOpen(true)
          console.log("Nota fiscal não encontrada")
          setTimeout(() => {
            this.router.navigate(['home'])
          }, 3000);
        }
      },
      error: (err: any) => {
        this.setOpen(true)
        console.log("Nota fiscal não encontrada")
        this.router.navigate(['home'])
      }
    })

  }

  async presentAlertQRCode() {
    const alert = await this.alertController.create({
      header: 'Criar Cobrança',
      //subHeader: 'Gerar QR Code',
      message: 'Tem certeza de que deseja gerar o QR Code de cobrança?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.router.navigate(['cobranca'])
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }

      ],
    });

    await alert.present();
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
        this.notaFiscal = result.content
        this.screenOrientation.unlock();
        this.scanActive = false
        document.querySelector('body')?.classList.remove('scanner-active');
        this.mostrarContasReceber(this.notaFiscal)

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
          handler: () => {
            this.router.navigate(['home'])
          }
        },
        {
          text: 'Abrir configurações do app',
          handler: () => {
            this.router.navigate(['home'])
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
    this.router.navigate(['home'])
  }


  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  trackItems(index: number, itemObject: any) {
    return itemObject.id;
  }

}
