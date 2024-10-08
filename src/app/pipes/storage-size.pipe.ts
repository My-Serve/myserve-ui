import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'storageSize',
  standalone: true
})
export class StorageSizePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {

    if (value < 0) {
      return 'Invalid size';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;

    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index++;
    }

    return `${value.toFixed(1)} ${units[index]}`;
  }

}
