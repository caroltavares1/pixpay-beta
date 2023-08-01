import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private plataforma: string = ''

  constructor(private platform: Platform,) { }

  getPlatform() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.plataforma = 'android'
        console.log('android');
      } else if (this.platform.is('ios')) {
        this.plataforma = 'ios'
        console.log('ios');
      } else if (this.platform.is('desktop')) {
        this.plataforma = 'desktop'
        //fallback to browser APIs or
        console.log('Desktop');
      } else {
        //fallback to browser APIs or
        console.log('The platform is not supported');
      }
    })
  }


  converteData(data: string,) {
    let dateObject
    let dateParts = data.split("/");
    if (dateParts[2].length == 2) {
      dateParts[2] = "20" + dateParts[2]
    }
    // month is 0-based, that's why we need dataParts[1] - 1
    //new Date(year, month, day)
    //Android retorna o string da data na forma "MM/DD/AA" enquanto o browser retorna "DD/MM/AA"
    //Então as duas formas precisam ser consideradas.
    if (this.plataforma in ['android', 'ios']) {
      dateObject = new Date(+dateParts[2], +dateParts[0] - 1, (Number(dateParts[1]))).toISOString().slice(0, 10);
    } else { //browser
      dateObject = new Date(+dateParts[2], (Number(dateParts[1]) - 1), +dateParts[0]).toISOString().slice(0, 10);
    }
    return dateObject
  }

  formataCNPJ(cnpj: string): string {
    //'12.103.781/0001-29'
    if (cnpj.length < 14) {
      return cnpj //caso por algum motivo o cnpj não tiver 14 dígitos
    } else {
      return (cnpj.substring(0, 2)) + '.' + cnpj.substring(2, 5) + '.' + cnpj.substring(5, 8) + '/' + cnpj.substring(8, 12) + '-' + cnpj.substring(12)
    }
  }
}
