import { Pipe, PipeTransform } from '@angular/core';
import {IUserIdentification} from "../models/profile-model";

@Pipe({
  name: 'nameParser',
  standalone: true
})
export class NameParserPipe implements PipeTransform {

  transform(value: IUserIdentification, ...args: unknown[]): unknown {
    value ??= {
      id: '',
      firstName: '',
      lastName: '',
      email: ''
    };
    return `${value.firstName} ${value.lastName}`;
  }

}
