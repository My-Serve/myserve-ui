import {Component, OnInit} from '@angular/core';
import {SidebarCollapsedComponent} from "./sidebar-collapsed/sidebar-collapsed.component";
import {AbstractStorageService} from "../../../services/abstracts/storage/abstract.storage.service";
import {ProfileService} from "../../../services/profile.service";
import {defaultSettings, Settings} from "../../../others/models/settings";
import {StorageKeys} from "../../../others/storage/storage.keys";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarCollapsedComponent,
  ],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements OnInit {

  protected sidebarCollapsed: boolean = false;

  constructor(
    protected readonly storageService: AbstractStorageService,
    protected readonly profileService: ProfileService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    const appSettings = await this.storageService.getOrDefaultAsync<Settings>(StorageKeys.LastPersistedSettings, defaultSettings);
    this.sidebarCollapsed = appSettings?.collapseSidebar ?? false;
  }

}
