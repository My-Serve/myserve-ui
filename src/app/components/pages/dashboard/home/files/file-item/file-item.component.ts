import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-file-item',
  standalone: true,
  imports: [],
  templateUrl: './file-item.component.html',
  styles: ``
})
export class FileItemComponent implements OnInit{
    ngOnInit(): void {
        console.log(123)
    }

}
