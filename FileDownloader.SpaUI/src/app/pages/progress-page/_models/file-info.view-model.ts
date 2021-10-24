import { BehaviorSubject } from "rxjs";
import { eStatus } from "../_enums/e-status.enum";

export class FileInfo {
    id: number;
    fileName: string;
    size: number;
    url: string;
    progress: BehaviorSubject<number>;
    status: eStatus;

    private _previousValue: number;

    constructor(id: number, fileName: string, size: number, url: string) {
        this.id = id;
        this.fileName = fileName;
        this.size = size;
        this.url = url;
        this.progress = new BehaviorSubject<number>(0);

        if(fileName.includes("Error")) {
            this.status = 3;
            return;
        }

        const subscription = this.progress.subscribe((value: number) => {
            this._previousValue = value;

            if(value === 0) {
                this.status = eStatus.waiting;
            }
            else if(value > 95) {
                this.status = eStatus.success;
            }
            else {
                this.status = eStatus.downloading;
            }
        })
    }
}