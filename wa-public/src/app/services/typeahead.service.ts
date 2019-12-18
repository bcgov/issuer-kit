import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { CpRequest } from '../models/cp-request';

export interface ICPItem {
  Error?: number;
  Description?: string;
  Cause?: string;
  Resolution?: string;
  Id?: string;
  Text?: string;
  Highlight?: string;
  isRetrievable?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TypeaheadService {
  $address: Observable<{ items: ICPItem[] }>;
  path = 'https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/AutoComplete/v1.00/json3.ws';

  constructor(private http: HttpClient) {}

  set address(val: any) {
    this.$address = of(val);
  }

  queryCp(req: any) {
    // const params = req as { [param: string]: string };
    const queryParams = '?' + Object.keys(req).map(key => `${key}=${req[key]}`).join('&')
    const url = `${this.path}${queryParams}`
    console.log('req url', url)
    const $res = this.http.get<{ items: ICPItem[] }>(url);
    $res.subscribe(obs => console.log(obs));
    return (this.$address = from($res));
    // https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/AutoComplete/v1.00/json3.ws
  }
}
