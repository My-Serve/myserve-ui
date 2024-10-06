import { Injectable } from '@angular/core';
import {MessageService} from "primeng/api";
import {EToastConstants} from "../constants/e-toast-constants";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private readonly messageService: MessageService,
  ) { }

  public warning(header: EToastConstants, message: string){
    this.messageService.add({
      severity: 'warning',
      summary: header,
      detail: message
    })
  }

  public error(header: EToastConstants, message: string){
    this.messageService.add({
      severity: 'error',
      summary: header,
      detail: message
    })
  }

  public info(header: EToastConstants, message: string){
    console.log(header)
    this.messageService.add({
      severity: 'info',
      summary: header,
      detail: message
    })
  }

  public success(header: EToastConstants, message: string){
    this.messageService.add({
      severity: 'success',
      summary: header,
      detail: message
    })
  }
}
