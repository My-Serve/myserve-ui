import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "@shared/sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
import {TopBarComponent} from "@shared/topbar/top-bar/top-bar.component";

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
