import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "../../../shared/sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";
import {TopBarComponent} from "../../../shared/topbar/top-bar/top-bar.component";
import {ActiveTaskService} from "../../../../services/active-task.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterOutlet,
    TopBarComponent
  ],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit{

  constructor(
  ) {
  }

  async ngOnInit(): Promise<void> {
  }


}
