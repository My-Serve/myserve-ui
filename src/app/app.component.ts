import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastModule} from "primeng/toast";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {SpinnerService} from "@services/spinner.service";
import {FullCalendarModule} from "@fullcalendar/angular";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ProgressSpinnerModule, FullCalendarModule, ConfirmDialogModule],
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
