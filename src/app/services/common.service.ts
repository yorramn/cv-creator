import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(
    private httpClient : HttpClient
  ) { }

  public findAllStates() : Observable<any> {
    return this.httpClient.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
  }

  public findAllCities(uf : string) : Observable<any> {
    return this.httpClient.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
  }
}
