import { Injectable } from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(
    private readonly messageService: MessageService,
  ) { }

  validateEmailAddress(email: string): boolean {
    return /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i.test(email);
  }


}
