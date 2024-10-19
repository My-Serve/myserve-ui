import { Component } from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {Button} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-require-encryption',
  standalone: true,
  imports: [
    DialogModule,
    Button,
    InputTextModule
  ],
  templateUrl: './require-encryption.component.html',
  styles: ``
})
export class RequireEncryptionComponent {

}
