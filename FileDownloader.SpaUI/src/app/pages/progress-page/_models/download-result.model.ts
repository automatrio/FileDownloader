import { FileInfo } from "./file-info.view-model";

export class DownloadResult {
    errors: string[];
    failedFiles: FileInfo[];
}