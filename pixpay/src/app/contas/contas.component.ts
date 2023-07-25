import { Component, Input, OnInit } from '@angular/core';
import { ContasAReceberService } from '../services/contas-areceber.service';
import { IonicModule, Platform } from '@ionic/angular';
import { ContasReceber } from '../services/contas-receber.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contas',
  templateUrl: './contas.component.html',
  styleUrls: ['./contas.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ContasComponent implements OnInit {

  @Input() notaFiscal: string

  contasreceber: ContasReceber[]
  plataform = ''

  constructor(private contasAreceber: ContasAReceberService, private platform: Platform) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.plataform = 'android'
        console.log('android');
      } else if (this.platform.is('ios')) {
        this.plataform = 'ios'
        console.log('ios');
      } else if (this.platform.is('desktop')) {
        this.plataform = 'desktop'
        //fallback to browser APIs or
        console.log('Desktop');
      } else {
        //fallback to browser APIs or
        console.log('The platform is not supported');
      }
    })

    console.log('Nota Fiscal', this.notaFiscal)


    this.contasAreceber.getUser('01', /* '83800000001577900110019166310101016117428313' */this.notaFiscal).subscribe({
      next: (v: any) => {

        this.contasreceber = v
        this.contasreceber.forEach(element => {
          console.log("data", element.dtVenc)
          element.dtVenc = this.converteData(element.dtVenc)
          return element
        });
        console.log(v)
      }
    })
  }

  converteData(data: string) {
    let dateObject
    let dateParts = data.split("/");
    if (dateParts[2].length == 2) {
      dateParts[2] = "20" + dateParts[2]
    }
    // month is 0-based, that's why we need dataParts[1] - 1
    //new Date(year, month, day)
    //Android retorna o string da data na forma "MM/DD/AA" enquanto o browser retorna "DD/MM/AA"
    //Então as duas formas precisam ser consideradas.
    if (this.plataform == 'android') {
      dateObject = new Date(+dateParts[2], +dateParts[0] - 1, (Number(dateParts[1]))).toISOString().slice(0, 10);
    } else {
      dateObject = new Date(+dateParts[2], (Number(dateParts[1]) - 1), +dateParts[0]).toISOString().slice(0, 10);
    }
    return dateObject
  }

  trackItems(index: number, itemObject: any) {
    return itemObject.id;
  }

}
