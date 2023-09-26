import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

const auth = environment.authorization

const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Access-Control-Allow-Origin': '*'
    }
  ),
  params: {}
};

@Injectable({
  providedIn: 'root'
})
export class ContasAReceberService {

  apiURL = environment.apiURL
  //apiURL = "http://192.168.1.7:8084/rest/api/retail/v1/retailItem"


  constructor(private http: HttpClient) { }

  public getUser(filial: string, nota: string): Observable<any> {
    const options = httpOptions
    options.params = {
      'FILIAL': filial,
      'CHVNFE': nota
    }

    let url = this.apiURL + '/contasReceber/'
    console.log("🚀 ~ file: contas-areceber.service.ts:37 ~ ContasAReceberService ~ getUser ~ url:", url)


    return this.http.get<any>(url, options).pipe(
      map((resposta: any) => console.log(resposta))
    );
  }
}
