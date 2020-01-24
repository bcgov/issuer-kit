import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';

const apiUrl = AppConfigService.settings.apiServer.url;

export type APISegmentType = 'invitations';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  url: any;

  post<T>(segment: APISegmentType, params = {}) {
    return this.http.post<T>(`${this.url}/${segment}`, params);
  }

  get<T>(segment: APISegmentType, params = {}, id?: string) {
    return id
      ? this.http.get<T>(`${this.url}/${segment}/${id}`, params)
      : this.http.get<T>(`${this.url}/${segment}`, params);
  }

  constructor(private http: HttpClient) {
    this.url = apiUrl;
  }
}
