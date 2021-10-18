import { Component, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  private data: {[name: string]: string} = {};

  constructor() { }

  public sendDataAcrossRouting(name: string, data: any) {
    this.data[name] = data;
  }

  public getDataAcrossRouting(name: string) {
    return this.data[name];
  }

}
