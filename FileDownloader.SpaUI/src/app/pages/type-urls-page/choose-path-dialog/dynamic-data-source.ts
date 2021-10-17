import { CollectionViewer, DataSource, SelectionChange } from "@angular/cdk/collections"
import { FlatTreeControl } from "@angular/cdk/tree";
import { Injectable } from "@angular/core";
import { BehaviorSubject, merge, Observable, ReplaySubject } from "rxjs";
import { map } from 'rxjs/operators';
import { TypeURLsPageService } from "../type-urls-page.service";
import { Folder } from "../_models/folder.model";

export class DynamicFlatNode {
    constructor(
        public name: string,
        public path: string,
        public level = 1,
        public expandable = false
        ) {}
  }
  
export class DynamicDataSource implements DataSource<DynamicFlatNode> {

    isLoadingSource = new ReplaySubject<boolean>();
    dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

    get data(): DynamicFlatNode[] { return this.dataChange.value; }

    set data(value: DynamicFlatNode[]) {
      this._treeControl.dataNodes = value;
      this.dataChange.next(value);
    }
  
    constructor(
        private _treeControl: FlatTreeControl<DynamicFlatNode>,
        private _service: TypeURLsPageService) {
    }

  
    public connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
      this._treeControl
        .expansionModel
        .changed
        .subscribe(change => {
            const selectionChange = (change as SelectionChange<DynamicFlatNode>);
            if (selectionChange.added || selectionChange.removed) {
                this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
            }
            
        });

        const mergedObservables = merge(collectionViewer.viewChange, this.dataChange)
        return mergedObservables.pipe(map(() => this.data));
    }
  
    disconnect(collectionViewer: CollectionViewer): void {}

    handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
        if (change.added) {
          change.added.forEach(async node => await this.toggleNode(node, true));
        }
        if (change.removed) {
          change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
        }
      }

    async toggleNode(node: DynamicFlatNode, expand: boolean) {

        this.isLoadingSource.next(true);

        const children = await this.getChildren(node);
        const index = this.data.indexOf(node);

        if (!children || index < 0) return;
    
        if (expand) {
            const nodes = this.mapFoldersToNodes(children, node);
            this.insertNodesIntoDataArray(index, nodes);
        } else {
            let count = 0;
            for (let i = index + 1;
                 i < this.data.length
                 && this.data[i].level > node.level;
                 i++) {
                  count++;
            }
            this.removeNodesFromDataArray(index, count);
        }

        // notify the change
        this.dataChange.next(this.data);
        this.isLoadingSource.next(false);
    }

    private getChildren(node: DynamicFlatNode) {
        return new Promise<Folder[]>(resolve => {
            const folderModel = {
                name: node.name,
                path: node.path
            } as Folder;
            this._service
                .getFolderHierarchy(folderModel)
                .subscribe(response => {
                    resolve((response as Folder).children);
            });
        });
    }

    private mapFoldersToNodes(folders: Folder[], node: DynamicFlatNode) {
        return folders
            .map(folder => new DynamicFlatNode(
                folder.name,
                folder.path,
                node.level + 1,
                folder.children.length > 0
            ));
    }

    private insertNodesIntoDataArray = (index: number, nodes: DynamicFlatNode[]) => this.data.splice(index + 1, 0, ...nodes);

    private removeNodesFromDataArray = (index: number, amount: number) => this.data.splice(index + 1, amount);
}