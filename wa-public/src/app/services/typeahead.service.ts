import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { CpRequest } from '../models/cp-request';
import { map } from 'rxjs/operators';

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
  $addresses: Observable<ICPItem[]>;
  path = 'https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/AutoComplete/v1.00/json3.ws';

  constructor(private http: HttpClient) {}

  set address(val: any) {
    this.$addresses = of(val);
  }

  queryCp(req: any) {
    const url = () => {
      const queryParams =
        '?' +
        Object.keys(req)
          .map(key => `${key}=${req[key]}`)
          .join('&');
      return () => `${this.path}${queryParams}`;
    };

    console.log('req url', url()());
    const $res = this.http.get<{ Items: ICPItem[] }>(url()());
    return (this.$addresses = $res.pipe(map(obs => obs.Items.filter(itm => itm.Text !== req))));
    // https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/AutoComplete/v1.00/json3.ws
  }
}
