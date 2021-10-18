import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _resource: string;
  private _subResource: string | null = null;

  constructor(private http: HttpClient) { }

  public setResource(resourceName: string) {
    this._resource = resourceName;
    return this;
  }

  public setSubResource(subResourceName: string) {
    this._subResource = subResourceName;
    return this;
  }

  public post(data: any) {
    const url = this.getBaseUrl();
    this.clearSubResource();
    return this.http.post(url, data);
  }
  
  public get() {
    const url = this.getBaseUrl();
    this.clearSubResource();
    return this.http.get(url);
  }

  public download() {
    const httpRequest = new HttpRequest(
      'GET',
      this.getBaseUrl(),
      null,
      {
        responseType: 'blob'
      }
    );
    this.clearSubResource();
    return this.http.request<Blob>(httpRequest);
  }

  public upload<T>(formData: FormData) {
    const httpRequest = new HttpRequest(
      'POST',
      this.getBaseUrl(),
      formData,
      {
        reportProgress: true
      }
    );
    return this.http.request<T>(httpRequest);
  }

  private getBaseUrl() {
    if(this._subResource)
      return environment.apiUrl + this._resource + '/' + this._subResource;
    return environment.apiUrl + this._resource;
  }

  private clearSubResource() {
    this._subResource = null;
  }
}
