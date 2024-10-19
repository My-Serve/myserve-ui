import {Component, OnInit, ViewChild} from '@angular/core';
import {FullCalendarComponent, FullCalendarModule} from "@fullcalendar/angular";
import {CalendarOptions} from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {BreadcrumbModule} from "primeng/breadcrumb";
import {CreateEditFileComponent} from "@shared/files/create-directory-name/create-edit-file.component";
import {DialogModule} from "primeng/dialog";
import {DividerModule} from "primeng/divider";
import {FileDropperDirective} from "@directives/file-dropper.directive";
import {FileItemComponent} from "@pages/dashboard/home/files/file-item/file-item.component";
import {FilesListComponent} from "@pages/dashboard/home/files/files-list/files-list.component";
import {SplitButtonModule} from "primeng/splitbutton";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    BreadcrumbModule,
    CreateEditFileComponent,
    DialogModule,
    DividerModule,
    FileDropperDirective,
    FileItemComponent,
    FilesListComponent,
    SplitButtonModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['calendar.component.scss']
})
export class CalendarComponent implements OnInit{
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    selectable: true,
    headerToolbar: {

    },
    slotDuration: '00:15:00',
    height: 'auto', // Or set a specific height
    // Other options...
  };

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  ngOnInit(): void {
  }
}
