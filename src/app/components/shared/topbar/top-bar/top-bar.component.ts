import { Component } from '@angular/core';
import {AutoCompleteModule} from "primeng/autocomplete";
import {PrimeTemplate} from "primeng/api";
import {Button} from "primeng/button";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    AutoCompleteModule,
    PrimeTemplate,
    Button,
    IconFieldModule,
    InputIconModule,
    InputTextModule
  ],
  templateUrl: './top-bar.component.html',
  styles: ``
})
export class TopBarComponent {

}
