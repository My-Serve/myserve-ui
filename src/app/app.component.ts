import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastModule} from "primeng/toast";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {SpinnerService} from "./services/spinner.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [SpinnerService],
})
export class AppComponent {

  constructor(
    protected readonly spinnerService: SpinnerService,
  ) {
  }

}
