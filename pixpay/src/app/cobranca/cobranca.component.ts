import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-cobranca',
  templateUrl: './cobranca.component.html',
  styleUrls: ['./cobranca.component.scss'],
  standalone: true,
  imports: [IonicModule, QRCodeModule]
})
export class CobrancaComponent implements OnInit {

  constructor() { }

  ngOnInit() { }


}
