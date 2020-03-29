import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaskMapService {

  // public resourceUrl = environment.apiUrl = 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json';
  public resourceUrl = 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json';

  constructor(private http: HttpClient) {
  }


  getStore(latitude, longitude, meter): any {
    const param = new HttpParams({
      fromObject: {
        lat: latitude,
        lng: longitude,
        m: meter
      }
    });
    return this.http
      .get(`${this.resourceUrl}`, {params: param, observe: 'response'});
  }
}
