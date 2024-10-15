import {Component, ViewChild} from '@angular/core';
import {AutoComplete, AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {PrimeTemplate} from "primeng/api";
import {Button} from "primeng/button";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {ISearchResult} from "@models/misc-models";
import {ProfileService} from "@services/profile.service";
import {NgIf} from "@angular/common";
import {TopBarItemComponent} from "@shared/topbar/top-bar-item/top-bar-item.component";
import {EFileType} from "@models/files-model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    AutoCompleteModule,
    PrimeTemplate,
    Button,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    NgIf,
    TopBarItemComponent
  ],
  templateUrl: './top-bar.component.html',
  styles: ``
})
export class TopBarComponent {

  @ViewChild('autoComplete') autoComplete!: AutoComplete;

  protected searchResults: ISearchResult[] = []
  protected searching: boolean = false;
  constructor(
    private readonly profileService: ProfileService,
    private readonly router: Router
  ) {
  }

  search(event: AutoCompleteCompleteEvent) {
    if(event.query.trim().length < 3)
      return;

    this.searching = true;
    this.profileService.search(event.query).subscribe({
      next: event => {
        this.searching = false;
        this.searchResults = event;
      },
      error: err => {
        this.searchResults = []
        this.searching = false;
      }
    })
  }

  async act(selected: ISearchResult){
    switch (selected.service) {
      case "File":
        await this.actOnFile(selected);
        break;
      case "Password":
        break;
      case "Calendar":
        break;
      case "Notes":
        break;
      case "ShareableLink":
        break;
    }
    this.autoComplete.value = "";
    this.autoComplete.clear();
    this.autoComplete.dirty = true;
  }

  private async actOnFile(selected: ISearchResult){
    const parentId = selected.metadata["ParentId"];
    const fileType = selected.metadata["Type"] as EFileType;
    if(!fileType || !parentId){
      return;
    }

    if(fileType === EFileType.Directory){
      await this.router.navigate(["home", "files", fileType.toLowerCase(), selected.id]);
    }else{
      await this.router.navigate(["home", "files", EFileType.Directory.toLowerCase(), parentId], {
        preserveFragment: false,
        fragment: selected.id
      });
    }
  }
}
