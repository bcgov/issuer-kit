import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export class IFormConfig {
  type: string;
  label: string;
  fieldName: string;
  placeholder: string;
  validators: string[];
  options: any[];
}

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {
  static fields: IFormConfig[];

  constructor(private http: HttpClient) {}

  load() {
    const jsonFile = 'assets/config/form-template.json';

    return new Promise<void>((resolve, reject) => {
      this.http
        .get(jsonFile)
        .toPromise()
        .then((response: IFormConfig[]) => {
          FormConfigService.fields = response as IFormConfig[];
          resolve();
        })
        .catch((response: any) => {
          reject(`Could not load the form configuration file`);
        });
    });
  }
}
