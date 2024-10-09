import {Component, input} from '@angular/core';

@Component({
  selector: 'app-unknown-previewer',
  standalone: true,
  imports: [],
  templateUrl: './unknown-previewer.component.html',
  styles: ``
})
export class UnknownPreviewerComponent {

  fileName = input.required<string>();

}
