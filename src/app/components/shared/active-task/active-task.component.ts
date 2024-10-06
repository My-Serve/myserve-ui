import {Component, OnInit} from '@angular/core';
import {ActiveTaskService} from "../../../services/active-task.service";
import {DialogModule} from "primeng/dialog";
import {TableModule} from "primeng/table";
import {ProgressBarModule} from "primeng/progressbar";

@Component({
  selector: 'app-active-task',
  standalone: true,
  imports: [
    DialogModule,
    TableModule,
    ProgressBarModule
  ],
  templateUrl: './active-task.component.html',
  styles: ``
})
export class ActiveTaskComponent implements OnInit{

  constructor(
    protected readonly activeTaskService: ActiveTaskService,
  ) {
  }

  ngOnInit(): void {

  }

  protected readonly Array = Array;
}
