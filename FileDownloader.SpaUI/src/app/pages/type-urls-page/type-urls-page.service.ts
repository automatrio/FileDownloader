import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewModel } from 'src/app/common/models/view-model';
import { ApiService } from 'src/app/common/services/api.service';
import { Folder } from './_models/folder.model';
import { PathValidationResult } from './_models/path.model';
import { URLs } from './_models/urls.view-model';

@Injectable({
  providedIn: 'root'
})
export class TypeURLsPageService {

  private model =  new URLs;

  constructor(private apiService: ApiService) {}

  public initiateViewModel() {
    return {
      model: this.model,
      form: this.initiateForms(),
      filterResult: []
    } as ViewModel<URLs>;
  }

  public getCurrentPath() {
    return this.apiService.setResource("path").get();
  }

  public validatePath(destinationPath: string) {
    const model = {
      path: destinationPath
    } as PathValidationResult;
    return this.apiService.setResource("path").post(model);
  }

  public getRootHierarchy() {
    return this.apiService.setResource("path").setSubResource("from-root").get();
  }

  public getFolderHierarchy(folder: Folder) {
    return this.apiService.setResource("path").setSubResource("from-folder").post(folder);
  }

  public setDestinationPath(destinationPath: string) {
    const model = {
      path: destinationPath,
      isValid: true
    } as PathValidationResult;
    return this.apiService.setResource("path").setSubResource("set").post(model);
  }
  
  private initiateForms() {
    return new FormGroup({
      listOfURLs: new FormControl(this.model.joinedURLs, [Validators.required]),
    });
  }
}
