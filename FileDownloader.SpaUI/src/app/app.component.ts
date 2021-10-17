import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PAGE_TRANSITION } from './common/animations/page-transition';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [PAGE_TRANSITION]
})
export class AppComponent {
  title = 'FileDownloaderSpaUI';

  constructor(
      private domSanitizer: DomSanitizer,
      private matIconRegistry: MatIconRegistry) {
    this.configureSvgIcons();
  }

  private configureSvgIcons() {
    this.matIconRegistry
      .addSvgIcon("folder", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/material_folder.svg"))
      .addSvgIcon("folder_open", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/material_folder_open.svg"));
  }
}
