import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toNumber',
  standalone: true
})
export class ToNumberPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): number {
    try {
      return parseInt(value.toString())
    }catch (err){
      return 0;
    }
  }

}
