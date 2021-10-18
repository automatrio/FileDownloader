import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/common/services/api.service';
import { URLs } from '../type-urls-page/_models/urls.view-model';

@Injectable({
  providedIn: 'root'
})
export class WelcomePageService {

  constructor(private apiService: ApiService) { }

  public uploadFile(file: File) {
    var formData = new FormData();
    formData.append("file", file);
    return this.apiService.setResource("upload").upload<URLs>(formData);
  }
}
