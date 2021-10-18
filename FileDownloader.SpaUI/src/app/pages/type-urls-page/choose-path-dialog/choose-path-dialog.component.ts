import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { TypeURLsPageService } from '../type-urls-page.service';
import { Folder } from '../_models/folder.model';
import { DynamicDataSource, DynamicFlatNode } from './dynamic-data-source';

@Component({
  selector: 'app-choose-path-dialog',
  templateUrl: './choose-path-dialog.component.html',
  styleUrls: ['./choose-path-dialog.component.css']
})
export class ChoosePathDialogComponent implements OnInit {

  isLoading: boolean;
  validationError: string;
  destinationPath: string;
  rootHierarchy: Folder;

  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;

  pathChosenSuccessfully = new EventEmitter<string>();

  constructor(private service: TypeURLsPageService) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, service);
    this.subscribeToLoadingEvent();
  }

  async ngOnInit() {
    this.dataSource.data = await this.getInitialData();
  }

  public selectDirectory(path: string) {
    this.destinationPath = path;
  }

  public onSubmit() {
    this.isLoading = true;
    this.service.validatePath(this.destinationPath).subscribe(() => {
      this.pathChosenSuccessfully.emit(this.destinationPath);
      this.waitForProgressBar();
    }, error => {
      this.validationError = "Either not a valid path, or folder doesn't exist.";
      this.waitForProgressBar();
    });
  }

  private getInitialData() {
    return new Promise<DynamicFlatNode[]>(resolve => {
      this.service
      .getRootHierarchy()
      .subscribe(response => {
        const rootDirectory = (<Folder> response);
        const rootNode = new DynamicFlatNode(
          rootDirectory.name,
          rootDirectory.path,
          0,
          true
        );
        resolve([rootNode]);
      });
    });
  }

  private subscribeToLoadingEvent() {
    this.dataSource.isLoadingSource.subscribe(isLoading => {
      if(isLoading) {
        this.isLoading = true;
      } else {
        this.waitForProgressBar();
      }
    });
  }

  private waitForProgressBar() {
    setTimeout(() => {
      this.isLoading = false;
    }, 750);
  }

  private getLevel = (node: DynamicFlatNode) => node.level;
  private isExpandable = (node: DynamicFlatNode) => node.expandable;
  public hasChild = (_: number, node: DynamicFlatNode) => node.expandable;
}
